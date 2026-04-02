import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { PaginationResponse } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from 'src/modules/product/presentation/dtos/req/create-product.dto';
import { GetAllProductQueryDto } from 'src/modules/product/presentation/dtos/req/get-all-product.dto';
import { SearchProductsDto } from 'src/modules/product/presentation/dtos/req/search-product.dto';
import { UpdateProductDto } from 'src/modules/product/presentation/dtos/req/update-product.dto';
import { ProductResponseDto } from 'src/modules/product/presentation/dtos/res/product.dto';
import type { UserContext } from 'src/modules/user/domain/interfaces/user-context.interface';

export abstract class ProductAbstract {
  abstract createProduct(
    data: CreateProductDto,
    userContext?: UserContext,
  ): Promise<BaseResponseDto<ProductResponseDto>>;
  abstract updateProduct(
    id: string,
    data: UpdateProductDto,
  ): Promise<BaseResponseDto<ProductResponseDto>>;
  abstract deleteProduct(
    id: string,
  ): Promise<BaseResponseDto<ProductResponseDto>>;
  abstract getProductById(
    id: string,
  ): Promise<BaseResponseDto<ProductResponseDto>>;
  abstract loadAllProduct(
    data: GetAllProductQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<ProductResponseDto>>>;
  // abstract loadProductByUserEmail(
  //   email: string,
  // ): Promise<BaseResponseDto<PaginationResponse<ProductResponseDto>>>;
  abstract searchProducts(
    data: SearchProductsDto,
  ): Promise<BaseResponseDto<PaginationResponse<ProductResponseDto>>>;
  abstract loadAllBrands(): Promise<any>;
}
