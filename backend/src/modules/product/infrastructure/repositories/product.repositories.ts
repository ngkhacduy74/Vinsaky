import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateOrderItemDto } from 'src/modules/order/presentation/dto/req/create-order.dto';
import { Product, ProductDocument } from '../database/product.schema';
import { ProductRepoAbstract } from 'src/modules/product/domain/repositories/product.repositories';
import { ProductEntity } from 'src/modules/product/domain/entities/product.entity';
import {
  ProductSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';
import { MongoQueryTransformer } from 'src/common/infrastructure/database/query-transformer';

@Injectable()
export class ProductRepository implements ProductRepoAbstract {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(payload: ProductEntity): Promise<ProductEntity> {
    const doc = new this.productModel(this.mapToPersistence(payload));
    const savedDocument = await doc.save();
    return this.mapToDomain(savedDocument);
  }

  async findAllProducts(skip: number, limit: number): Promise<ProductEntity[]> {
    const documents = await this.productModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async countAllProducts(): Promise<number> {
    return this.productModel.countDocuments({}).exec();
  }

  async findByProductId(id: string): Promise<ProductEntity | null> {
    const document = await this.productModel.findOne({ id }).exec();
    return document ? this.mapToDomain(document) : null;
  }

  async loadAllBrands(): Promise<string[]> {
    return this.productModel.distinct('brand').exec();
  }

  async updateByProductId(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    const document = await this.productModel
      .findOneAndUpdate(
        { id },
        { $set: this.mapToPersistence(data) },
        { new: true },
      )
      .exec();
    return document ? this.mapToDomain(document) : null;
  }

  async deleteByProductId(id: string): Promise<ProductEntity | null> {
    const document = await this.productModel.findOneAndDelete({ id }).exec();
    return document ? this.mapToDomain(document) : null;
  }

  async searchProducts(
    query: ProductSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<ProductEntity[]> {
    const mongoQuery = MongoQueryTransformer.transformSearchQuery(query);
    const mongoSort = MongoQueryTransformer.transformSortQuery(sort);

    const documents = await this.productModel
      .find(mongoQuery)
      .sort(mongoSort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async countSearchProducts(query: ProductSearchQuery): Promise<number> {
    const mongoQuery = MongoQueryTransformer.transformSearchQuery(query);
    return this.productModel.countDocuments(mongoQuery).exec();
  }

  async decrementIfEnough(
    productId: string,
    qty: number,
    session?: ClientSession,
  ): Promise<boolean> {
    const res = await this.productModel.updateOne(
      { id: productId, quantity: { $gte: qty } },
      { $inc: { quantity: -qty } },
      session ? { session } : undefined,
    );
    return res.modifiedCount > 0;
  }

  async checkAndReserveStock(
    items: CreateOrderItemDto[],
    session?: ClientSession,
  ): Promise<{ ok: true } | { ok: false; failedItemName: string }> {
    for (let i = 0; i < items.length; i++) {
      const ok = await this.decrementIfEnough(
        items[i].product_id,
        Number(items[i].quantity),
        session,
      );
      if (!ok)
        return {
          ok: false,
          failedItemName: items[i].name || `Sản phẩm ${i + 1}`,
        };
    }
    return { ok: true };
  }

  private mapToDomain(document: any): ProductEntity {
    return ProductEntity.create({
      id: document.id,
      image: document.image,
      video: document.video,
      name: document.name,
      brand: document.brand,
      category: document.category,
      price: document.price,
      description: document.description,
      size: document.size,
      weight: document.weight,
      status: document.status,
      warranty_period: document.warranty_period,
      business_phone: document.business_phone,
      voltage: document.voltage,
      features: document.features,
      quantity: document.quantity,
      creator: document.creator || {
        id: '',
        fullname: '',
        phone: '',
        email: '',
      },
    });
  }

  private mapToPersistence(
    entity: Partial<ProductEntity>,
  ): Partial<ProductEntity> {
    return {
      id: entity.id,
      image: entity.image,
      video: entity.video,
      name: entity.name,
      brand: entity.brand,
      category: entity.category,
      price: entity.price,
      description: entity.description,
      size: entity.size,
      weight: entity.weight,
      status: entity.status,
      warranty_period: entity.warranty_period,
      business_phone: entity.business_phone,
      voltage: entity.voltage,
      features: entity.features,
      quantity: entity.quantity,
      creator: entity.creator,
    };
  }
}
