import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BannerProduct,
  BannerProductDocument,
  BannerProductIds,
  BannerProductIdsDocument,
} from '../database/banner.schema';
import { IBannerRepository } from '../../domain/repositories/banner.repository';
import {
  BannerEntity,
  BannerProductIdsEntity,
} from '../../domain/entities/banner.entity';

@Injectable()
export class BannerRepository implements IBannerRepository {
  constructor(
    @InjectModel(BannerProduct.name)
    private readonly bannerModel: Model<BannerProductDocument>,
    @InjectModel(BannerProductIds.name)
    private readonly configModel: Model<BannerProductIdsDocument>,
  ) {}

  async createBanner(banner: BannerEntity): Promise<BannerEntity> {
    const data = this.toPersistence(banner);
    const doc = await this.bannerModel.create(data);
    return this.toDomain(doc);
  }

  async findAllBanners(
    skip: number = 0,
    limit: number = 10,
  ): Promise<BannerEntity[]> {
    const docs = await this.bannerModel
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findByBannerId(id: string): Promise<BannerEntity | null> {
    const doc = await this.bannerModel.findOne({ id }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async updateByBannerId(
    id: string,
    data: Partial<BannerEntity>,
  ): Promise<BannerEntity | null> {
    const doc = await this.bannerModel
      .findOneAndUpdate({ id }, { $set: data }, { new: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async deleteByBannerId(id: string): Promise<BannerEntity | null> {
    const doc = await this.bannerModel.findOneAndDelete({ id }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async countBanners(): Promise<number> {
    return this.bannerModel.countDocuments({ isActive: true }).exec();
  }

  async getBannerProductIds(): Promise<BannerProductIdsEntity | null> {
    const doc = await this.configModel.findOne({}).exec();
    if (!doc) return null;
    return new BannerProductIdsEntity(
      doc.productIds,
      doc.isActive,
      doc.maxProducts,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async updateBannerProductIds(
    data: Partial<BannerProductIdsEntity>,
  ): Promise<BannerProductIdsEntity> {
    const doc = await this.configModel
      .findOneAndUpdate({}, { $set: data }, { upsert: true, new: true })
      .exec();
    return new BannerProductIdsEntity(
      doc.productIds,
      doc.isActive,
      doc.maxProducts,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  private toDomain(doc: any): BannerEntity {
    return new BannerEntity(
      doc.id,
      doc.name,
      doc.description,
      doc.price,
      doc.image,
      doc.badge,
      doc.category,
      doc.discount,
      doc.buttonText,
      doc.isActive,
      doc.order,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  private toPersistence(entity: BannerEntity): Partial<BannerProduct> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      image: entity.image,
      badge: entity.badge,
      category: entity.category,
      discount: entity.discount,
      buttonText: entity.buttonText,
      isActive: entity.isActive,
      order: entity.order,
    };
  }
}
