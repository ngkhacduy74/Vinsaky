import { BannerEntity, BannerProductIdsEntity } from '../entities/banner.entity';

export abstract class IBannerRepository {
  // Banner Products
  abstract createBanner(banner: BannerEntity): Promise<BannerEntity>;
  abstract findAllBanners(skip?: number, limit?: number): Promise<BannerEntity[]>;
  abstract findByBannerId(id: string): Promise<BannerEntity | null>;
  abstract updateByBannerId(id: string, data: Partial<BannerEntity>): Promise<BannerEntity | null>;
  abstract deleteByBannerId(id: string): Promise<BannerEntity | null>;
  abstract countBanners(): Promise<number>;

  // Banner Product IDs (Configuration)
  abstract getBannerProductIds(): Promise<BannerProductIdsEntity | null>;
  abstract updateBannerProductIds(data: Partial<BannerProductIdsEntity>): Promise<BannerProductIdsEntity>;
}
