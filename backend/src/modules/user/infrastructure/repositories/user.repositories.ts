import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepoAbstract } from 'src/modules/user/domain/repositories/user.abstract.repo';
import { User, UserDocument } from '../database/user.schema';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { UserSearchQuery, SortQuery } from 'src/common/interfaces/query.interface';
import { MongoQueryTransformer } from 'src/common/infrastructure/database/query-transformer';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements UserRepoAbstract {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.userModel.findOne({ email }).exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async createUser(payload: Partial<UserEntity>): Promise<UserEntity> {
    const doc = new this.userModel(UserMapper.toPersistence(payload));
    const savedDocument = await doc.save();
    return UserMapper.toDomain(savedDocument);
  }

  async count(query: UserSearchQuery): Promise<number> {
    const mongoQuery = MongoQueryTransformer.transformUserSearchQuery(query);
    return this.userModel.countDocuments(mongoQuery);
  }

  async findWithPagination(
    query: UserSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<UserEntity[]> {
    const mongoQuery = MongoQueryTransformer.transformUserSearchQuery(query);
    const mongoSort = MongoQueryTransformer.transformSortQuery(sort);
    
    const documents = await this.userModel
      .find(mongoQuery)
      .sort(mongoSort)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean()
      .exec();
    return UserMapper.toDomainArray(documents);
  }

  async updateByUserId(id: string, payload: Partial<UserEntity>): Promise<UserEntity | null> {
    const document = await this.userModel
      .findOneAndUpdate({ id }, UserMapper.toPersistence(payload), { new: true })
      .lean()
      .exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async findByUserId(id: string): Promise<UserEntity | null> {
    const document = await this.userModel.findOne({ id }).lean().exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async softDeleteByUserId(id: string): Promise<UserEntity | null> {
    const document = await this.userModel
      .findOneAndUpdate(
        { id, is_deleted: false },
        {
          is_deleted: true,
          deleted_at: new Date(),
        },
        { new: true },
      )
      .lean()
      .exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async findWithFilters(query: UserSearchQuery, skip: number, limit: number, sort: SortQuery): Promise<UserEntity[]> {
    const mongoQuery = MongoQueryTransformer.transformUserSearchQuery(query);
    const mongoSort = MongoQueryTransformer.transformSortQuery(sort);
    
    const documents = await this.userModel
      .find(mongoQuery)
      .sort(mongoSort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    
    return UserMapper.toDomainArray(documents);
  }

}
