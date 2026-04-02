import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostRepoAbstract } from 'src/modules/post/domain/repositories/post.repositories';
import { Post, PostDocument } from '../database/post.schema';
import { PostEntity } from 'src/modules/post/domain/entities/post.entity';
import { IPost } from 'src/modules/post/domain/interfaces/post.interface';
import { PostSearchQuery, SortQuery } from 'src/common/interfaces/query.interface';
import { MongoQueryTransformer } from 'src/common/infrastructure/database/query-transformer';
import { PostMapper } from 'src/modules/post/infrastructure/mappers/post.mapper';

@Injectable()
export class PostRepository implements PostRepoAbstract {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(doc: Partial<IPost>): Promise<PostEntity> {
    const document = await this.postModel.create(this.mapToPersistence(doc));
    return PostMapper.toDomain(document);
  }

  async findOne(filter: Partial<IPost>): Promise<PostEntity | null> {
    const mongoFilter = this.mapToPersistence(filter);
    const document = await this.postModel.findOne(mongoFilter);
    return document ? PostMapper.toDomain(document) : null;
  }

  async findById(id: string): Promise<PostEntity | null> {
    const document = await this.postModel.findById(id);
    return document ? PostMapper.toDomain(document) : null;
  }

  async findByIdWithSeller(id: string): Promise<PostEntity | null> {
    const document = await this.postModel.findById(id).populate('seller');
    return document ? PostMapper.toDomain(document) : null;
  }

  async count(filter: Record<string, any>) {
    return this.postModel.countDocuments(filter);
  }

  async countPosts(query: PostSearchQuery): Promise<number> {
    const mongoQuery = MongoQueryTransformer.transformPostSearchQuery(query);
    return this.postModel.countDocuments(mongoQuery);
  }

  async findPosts(query: PostSearchQuery, skip: number, limit: number, sort: SortQuery): Promise<PostEntity[]> {
    const mongoQuery = MongoQueryTransformer.transformPostSearchQuery(query);
    const mongoSort = MongoQueryTransformer.transformSortQuery(sort);
    
    const documents = await this.postModel
      .find(mongoQuery)
      .sort(mongoSort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    
    return documents.map(doc => PostMapper.toDomain(doc));
  }

  async findMany(
    filter: Record<string, any>,
    options: { skip: number; limit: number; sort?: Record<string, 1 | -1> },
  ): Promise<PostEntity[]> {
    const { skip, limit, sort = { createdAt: -1 } } = options;
    const documents = await this.postModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return documents.map(doc => PostMapper.toDomain(doc));
  }

  async updateById(id: string, update: Partial<IPost> | Record<string, any>): Promise<PostEntity | null> {
    const document = await this.postModel.findByIdAndUpdate(
      id,
      update, // Pass update directly to handle both Partial<IPost> and MongoDB operators
      { new: true }
    );
    return document ? PostMapper.toDomain(document) : null;
  }

  async deleteById(id: string): Promise<PostEntity | null> {
    const document = await this.postModel.findByIdAndDelete(id);
    return document ? PostMapper.toDomain(document) : null;
  }

  // Interaction methods
  async addComment(id: string, comment: any): Promise<PostEntity | null> {
    const document = await this.postModel.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    return document ? PostMapper.toDomain(document) : null;
  }

  async toggleLike(id: string, userId: string): Promise<PostEntity | null> {
    const post = await this.postModel.findById(id);
    if (!post) return null;
    
    const isLiked = post.likes.includes(userId);
    const document = await this.postModel.findByIdAndUpdate(
      id,
      isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
      { new: true }
    );
    return document ? PostMapper.toDomain(document) : null;
  }

  async toggleFavorite(id: string, userId: string): Promise<PostEntity | null> {
    const post = await this.postModel.findById(id);
    if (!post) return null;
    
    const isFavorited = post.favorites.includes(userId);
    const document = await this.postModel.findByIdAndUpdate(
      id,
      isFavorited ? { $pull: { favorites: userId } } : { $addToSet: { favorites: userId } },
      { new: true }
    );
    return document ? PostMapper.toDomain(document) : null;
  }

  private mapToDomain(document: any): IPost {
    return {
      id: document.id,
      category: document.category,
      image: document.image,
      video: document.video,
      status: document.status,
      title: document.title,
      user_position: document.user_position,
      address: document.address,
      description: document.description,
      content: document.content,
      seller: document.seller,
      condition: document.condition,
      comments: document.comments,
      likes: document.likes,
      favorites: document.favorites,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  private mapToPersistence(entity: Partial<IPost>): Partial<Post> {
    return {
      id: entity.id,
      category: entity.category,
      image: entity.image,
      video: entity.video,
      status: entity.status,
      title: entity.title,
      user_position: entity.user_position,
      address: entity.address,
      description: entity.description,
      content: entity.content,
      seller: entity.seller as any, // Type casting for IUserInPost to User
      condition: entity.condition,
      comments: entity.comments,
      likes: entity.likes,
      favorites: entity.favorites,
    };
  }
}
