import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductAbstract } from 'src/modules/product/application/product.abstract';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiDescription } from 'src/decorators/http.decorators';
import { Role, Roles } from 'src/decorators/role.decorator';
import { CreateProductDto } from 'src/modules/product/presentation/dtos/req/create-product.dto';
import { SearchProductsDto } from 'src/modules/product/presentation/dtos/req/search-product.dto';
import { UpdateProductDto } from 'src/modules/product/presentation/dtos/req/update-product.dto';
import { ProductResponseDto } from 'src/modules/product/presentation/dtos/res/product.dto';
import { JwtAuthGuard } from 'src/guard/permission.guard';
import { RoleGuard } from 'src/guard/role.guard';
import type { UserContext } from 'src/modules/user/domain/interfaces/user-context.interface';
@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductAbstract) {}

  @Post()
  @ApiDescription({ summary: 'Tạo sản phẩm mới' ,type: ProductResponseDto})
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: CreateProductDto, @CurrentUser() user?: UserContext) {
    return await this.productService.createProduct(body, user);
  }
  @Patch(':id')
  @ApiDescription({ summary: 'Cập nhật thông tin sản phẩm' ,type: ProductResponseDto})
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return await this.productService.updateProduct(id, body);
  }
  @Delete(':id')
  @ApiDescription({ summary: 'Xóa sản phẩm' ,type: ProductResponseDto})
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }
  @Get('brands')
  @ApiDescription({ summary: 'Lấy danh sách thương hiệu' ,type: [String] })
  @HttpCode(HttpStatus.OK)
  async loadAllBrands() {
    return await this.productService.loadAllBrands();
  }
  @Get()
  @ApiDescription({ summary: 'Lấy danh sách sản phẩm' ,type: [ProductResponseDto] })
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  async listProducts(@Query() query: SearchProductsDto) {
    return await this.productService.searchProducts(query);
  }
  @Get(':id')
  @ApiDescription({ summary: 'Lấy thông tin sản phẩm' ,type: ProductResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }
}
