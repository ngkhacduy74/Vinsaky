import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BannerProduct,
  BannerProductSchema,
  BannerProductIds,
  BannerProductIdsSchema,
} from './infrastructure/database/banner.schema';
import { IBannerRepository } from './domain/repositories/banner.repository';
import { BannerRepository } from './infrastructure/repositories/banner.repository';
import { BannerService } from './application/banner.service';
import { BannerController } from './presentation/banner.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BannerProduct.name, schema: BannerProductSchema },
      { name: BannerProductIds.name, schema: BannerProductIdsSchema },
    ]),
  ],
  controllers: [BannerController],
  providers: [
    {
      provide: IBannerRepository,
      useClass: BannerRepository,
    },
    BannerService,
  ],
  exports: [BannerService, IBannerRepository],
})
export class BannerModule {}
