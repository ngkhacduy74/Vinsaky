import { ProductEntity } from 'src/modules/product/domain/entities/product.entity';
import { CreateProductDto } from 'src/modules/product/presentation/dtos/req/create-product.dto';
import { UpdateProductDto } from 'src/modules/product/presentation/dtos/req/update-product.dto';
import { ProductStatus } from 'src/modules/product/domain/interfaces/product.interface';
import type { UserContext } from 'src/modules/user/domain/interfaces/user-context.interface';

export class ProductDomainService {
  static validateCreateData(data: CreateProductDto): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (!data.price || data.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (!data.category || data.category.trim().length === 0) {
      throw new Error('Product category is required');
    }

    if (!data.brand || data.brand.trim().length === 0) {
      throw new Error('Product brand is required');
    }

    if (!data.business_phone || data.business_phone.trim().length === 0) {
      throw new Error('Business phone is required');
    }

    if (!data.image || data.image.length === 0) {
      throw new Error('At least one product image is required');
    }
  }

  static validateUpdateData(data: UpdateProductDto): void {
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
  }

  static createProductEntity(
    data: CreateProductDto,
    user: UserContext,
  ): ProductEntity {
    this.validateCreateData(data);

    return ProductEntity.create({
      image: data.image || [],
      video: data.video || [],
      name: data.name,
      brand: data.brand,
      category: data.category,
      price: data.price,
      description: data.description || '',
      size: data.size,
      weight: data.weight,
      status: data.status || ProductStatus.New,
      warranty_period: data.warranty_period || 12,
      business_phone: data.business_phone || '',
      voltage: data.voltage,
      features: data.features,
      quantity: data.quantity || 0,
      creator: user,
    });
  }

  static updateProductEntity(
    existingProduct: ProductEntity,
    updateData: UpdateProductDto,
  ): ProductEntity {
    this.validateUpdateData(updateData);

    return existingProduct.update({
      name: updateData.name,
      brand: updateData.brand,
      category: updateData.category,
      price: updateData.price,
      description: updateData.description,
      size: updateData.size,
      weight: updateData.weight,
      status: updateData.status,
      warranty_period: updateData.warranty_period,
      business_phone: updateData.business_phone,
      voltage: updateData.voltage,
      features: updateData.features,
      quantity: updateData.quantity,
      image: updateData.image,
      video: updateData.video,
    });
  }

  static buildSearchQuery(data: {
    search?: string;
    category?: string;
    brand?: string;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
  }): Record<string, any> {
    const query: Record<string, any> = {};

    if (data.search) {
      query.$or = [
        { name: { $regex: data.search, $options: 'i' } },
        { brand: { $regex: data.search, $options: 'i' } },
        { description: { $regex: data.search, $options: 'i' } },
      ];
    }

    if (data.category) {
      query.category = { $regex: data.category, $options: 'i' };
    }

    if (data.brand) {
      query.brand = { $regex: data.brand, $options: 'i' };
    }

    if (data.status) {
      query.status = data.status;
    }

    if (data.minPrice !== undefined || data.maxPrice !== undefined) {
      query.price = {};
      if (data.minPrice !== undefined) query.price.$gte = data.minPrice;
      if (data.maxPrice !== undefined) query.price.$lte = data.maxPrice;
    }

    return query;
  }
}
