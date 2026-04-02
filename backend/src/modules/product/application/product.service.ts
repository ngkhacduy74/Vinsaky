import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { PaginationResponse } from 'src/common/dto/pagination.dto';
import { ProductAbstract } from 'src/modules/product/application/product.abstract';
import { ProductRepoAbstract } from 'src/modules/product/domain/repositories/product.repositories';
import { CreateProductDto } from 'src/modules/product/presentation/dtos/req/create-product.dto';
import { ProductResponseDto } from 'src/modules/product/presentation/dtos/res/product.dto';
import { GetAllProductQueryDto } from 'src/modules/product/presentation/dtos/req/get-all-product.dto';
import { UpdateProductDto } from 'src/modules/product/presentation/dtos/req/update-product.dto';
import { SearchProductsDto } from 'src/modules/product/presentation/dtos/req/search-product.dto';
import type { UserContext } from 'src/modules/user/domain/interfaces/user-context.interface';
import { ErrorHandlerUtil } from 'src/utils/error-handler.util';
import { ProductQueryService } from 'src/modules/product/domain/services/product-query.service';
import { ProductDomainService } from 'src/modules/product/domain/services/product-domain.service';
import { ProductMapper } from 'src/modules/user/infrastructure/mappers/product.mapper';
import { PaginationUtil } from 'src/utils/pagination.util';
import { ResponseBuilderUtil } from 'src/utils/response-builder.util';

@Injectable()
export class ProductService extends ProductAbstract {
  constructor(private readonly productRepositories: ProductRepoAbstract) {
    super();
  }
  async createProduct(
    data: CreateProductDto,
    user?: UserContext,
  ): Promise<BaseResponseDto<ProductResponseDto>> {
    try {
      if (!user) {
        throw new BadRequestException('User authentication required');
      }

      const newProduct = ProductDomainService.createProductEntity(data, user);
      const created = await this.productRepositories.createProduct(newProduct);
      const response = ProductMapper.toResponseDto(created);

      return {
        success: true,
        data: response,
      };
    } catch (err: any) {
      throw ErrorHandlerUtil.handleMongoDuplicateError(err, 'Sản phẩm');
    }
  }
  async loadAllProduct(
    data: GetAllProductQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<ProductResponseDto>>> {
    try {
      const { skip, limit } = PaginationUtil.calculateSkipLimit(
        data.skip,
        data.limit,
      );

      const [items, total] = await Promise.all([
        this.productRepositories.findAllProducts(skip, limit),
        this.productRepositories.countAllProducts(),
      ]);

      const responseItems = ProductMapper.toResponseDtoList(items);

      const paginationData = PaginationUtil.createPaginationResponse(
        responseItems,
        total,
        skip,
        limit,
      );

      return ResponseBuilderUtil.success(
        'Lấy danh sách sản phẩm thành công',
        paginationData,
      );
    } catch (err: any) {
      throw new InternalServerErrorException({
        message: 'Lấy danh sách sản phẩm thất bại',
        errors: err?.message,
      });
    }
  }
  async getProductById(
    id: string,
  ): Promise<BaseResponseDto<ProductResponseDto>> {
    try {
      if (!id) {
        throw new BadRequestException('Id không được để trống');
      }

      const product = await this.productRepositories.findByProductId(id);

      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }

      const response = ProductMapper.toResponseDto(product);

      return {
        success: true,
        data: response,
      };
    } catch (err: any) {
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }

      throw new InternalServerErrorException({
        message: 'Lấy sản phẩm thất bại',
        errors: err?.message,
      });
    }
  }
  async loadAllBrands(): Promise<BaseResponseDto<string[]>> {
    try {
      const brands = await this.productRepositories.loadAllBrands();

      return {
        success: true,
        data: brands,
      };
    } catch (err: any) {
      throw ErrorHandlerUtil.handleServiceError(err, 'Lấy danh sách hãng');
    }
  }
  async updateProduct(
    id: string,
    data: UpdateProductDto,
  ): Promise<BaseResponseDto<ProductResponseDto>> {
    try {
      if (!id) {
        throw new BadRequestException('Id không được để trống');
      }
      if (!data || Object.keys(data).length === 0) {
        throw new BadRequestException('Dữ liệu cập nhật không được để trống');
      }

      const existingProduct =
        await this.productRepositories.findByProductId(id);
      if (!existingProduct) {
        throw new NotFoundException('Không tìm thấy sản phẩm để cập nhật');
      }

      const updatedProduct = ProductDomainService.updateProductEntity(
        existingProduct,
        data,
      );
      const updated = await this.productRepositories.updateByProductId(
        id,
        updatedProduct,
      );

      if (!updated) {
        throw new NotFoundException('Không tìm thấy sản phẩm để cập nhật');
      }

      const response = ProductMapper.toResponseDto(updated);

      return {
        success: true,
        data: response,
      };
    } catch (err: any) {
      throw ErrorHandlerUtil.handleMongoDuplicateError(err, 'Sản phẩm');
    }
  }
  async deleteProduct(
    id: string,
  ): Promise<BaseResponseDto<ProductResponseDto>> {
    try {
      if (!id) {
        throw new BadRequestException('Id không được để trống');
      }

      const deleted = await this.productRepositories.deleteByProductId(id);

      if (!deleted) {
        throw new NotFoundException('Không tìm thấy sản phẩm để xóa');
      }

      const response = ProductMapper.toResponseDto(deleted);

      return {
        success: true,
        data: response,
      };
    } catch (err: any) {
      throw ErrorHandlerUtil.handleServiceError(err, 'Xóa sản phẩm');
    }
  }
  async searchProducts(
    data: SearchProductsDto,
  ): Promise<BaseResponseDto<PaginationResponse<ProductResponseDto>>> {
    try {
      const {
        search,
        category,
        brand,
        status,
        minPrice,
        maxPrice,
        skip: rawSkip,
        limit: rawLimit,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = data;

      const { skip, limit } = PaginationUtil.calculateSkipLimit(
        rawSkip,
        rawLimit,
      );

      const query = ProductQueryService.buildSearchQuery({
        search,
        category,
        brand,
        status,
        minPrice,
        maxPrice,
      });

      const sort = ProductQueryService.buildSortQuery(sortBy, sortOrder);

      const [items, total] = await Promise.all([
        this.productRepositories.searchProducts(query, skip, limit, sort),
        this.productRepositories.countSearchProducts(query),
      ]);

      const responseItems = ProductMapper.toResponseDtoList(items);

      const paginationData = PaginationUtil.createPaginationResponse(
        responseItems,
        total,
        skip,
        limit,
      );

      return ResponseBuilderUtil.success(
        'Tìm kiếm sản phẩm thành công',
        paginationData,
      );
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException({
        message: 'Tìm kiếm sản phẩm thất bại',
        errors: err?.message,
      });
    }
  }
}
