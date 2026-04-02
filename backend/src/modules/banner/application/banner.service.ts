import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IBannerRepository } from '../domain/repositories/banner.repository';
import { BannerEntity, BannerProductIdsEntity } from '../domain/entities/banner.entity';
import { CreateBannerDto, UpdateBannerDto } from '../presentation/dtos/banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepo: IBannerRepository) {}

  async createBanner(data: CreateBannerDto): Promise<BannerEntity> {
    try {
      const banner = BannerEntity.create(data);
      return await this.bannerRepo.createBanner(banner);
    } catch (err: any) {
      throw new InternalServerErrorException({
        message: 'Tạo banner thất bại',
        error: err.message,
      });
    }
  }

  async getAllBanners(skip?: number, limit?: number): Promise<BannerEntity[]> {
    try {
      return await this.bannerRepo.findAllBanners(skip, limit);
    } catch (err: any) {
      throw new InternalServerErrorException({
        message: 'Lấy danh sách banner thất bại',
        error: err.message,
      });
    }
  }

  async getBannerById(id: string): Promise<BannerEntity> {
    const banner = await this.bannerRepo.findByBannerId(id);
    if (!banner) throw new NotFoundException('Không tìm thấy banner');
    return banner;
  }

  async updateBanner(id: string, data: UpdateBannerDto): Promise<BannerEntity> {
    const existing = await this.getBannerById(id);
    const updated = existing.update(data);
    const result = await this.bannerRepo.updateByBannerId(id, updated);
    if (!result) throw new NotFoundException('Không tìm thấy banner để cập nhật');
    return result;
  }

  async deleteBanner(id: string): Promise<BannerEntity> {
    const result = await this.bannerRepo.deleteByBannerId(id);
    if (!result) throw new NotFoundException('Không tìm thấy banner để xóa');
    return result;
  }

  async getBannerConfigs(): Promise<BannerProductIdsEntity> {
    const config = await this.bannerRepo.getBannerProductIds();
    if (!config) return BannerProductIdsEntity.create({ productIds: [] });
    return config;
  }

  async updateBannerConfigs(data: Partial<BannerProductIdsEntity>): Promise<BannerProductIdsEntity> {
    return await this.bannerRepo.updateBannerProductIds(data);
  }
}
