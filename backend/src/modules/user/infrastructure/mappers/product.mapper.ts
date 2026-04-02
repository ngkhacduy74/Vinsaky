import { ProductEntity } from 'src/modules/product/domain/entities/product.entity';
import { ProductResponseDto, CreatorResponseDto } from 'src/modules/product/presentation/dtos/res/product.dto';

export class ProductMapper {
  static toResponseDto(product: ProductEntity): ProductResponseDto {
    const creator: CreatorResponseDto = {
      email: product.creator.email,
    };

    return {
      id: product.id,
      _id: product.id, // MongoDB _id mapping
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description,
      size: product.size,
      weight: product.weight,
      status: product.status,
      warranty_period: product.warranty_period,
      business_phone: product.business_phone,
      voltage: product.voltage,
      features: product.features,
      quantity: product.quantity,
      creator,
      image: product.image,
      video: product.video,
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date(),
    };
  }

  static toResponseDtoList(products: ProductEntity[]): ProductResponseDto[] {
    return products.map(product => ProductMapper.toResponseDto(product));
  }
}
