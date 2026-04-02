import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BannerService } from '../application/banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dtos/banner.dto';
import { JwtAuthGuard } from 'src/guard/permission.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Role, Roles } from 'src/decorators/role.decorator';

@ApiTags('banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo banner mới (Admin)' })
  async create(@Body() data: CreateBannerDto) {
    return await this.bannerService.createBanner(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả banner đang hoạt động' })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    return await this.bannerService.getAllBanners(
      Number(skip) || 0,
      Number(limit) || 10,
    );
  }

  @Get('configs')
  @ApiOperation({ summary: 'Lấy cấu hình hiển thị banner' })
  async getConfigs() {
    return await this.bannerService.getBannerConfigs();
  }

  @Put('configs')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật cấu hình hiển thị banner (Admin)' })
  async updateConfigs(@Body() data: any) {
    return await this.bannerService.updateBannerConfigs(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết banner theo ID' })
  async findOne(@Param('id') id: string) {
    return await this.bannerService.getBannerById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật banner theo ID (Admin)' })
  async update(@Param('id') id: string, @Body() data: UpdateBannerDto) {
    return await this.bannerService.updateBanner(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa banner theo ID (Admin)' })
  async delete(@Param('id') id: string) {
    return await this.bannerService.deleteBanner(id);
  }
}
