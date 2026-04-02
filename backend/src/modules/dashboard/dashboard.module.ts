import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './presentation/dashboard.controller';
import { DashboardService } from './application/dashboard.service';
import { DashboardRepository } from './infrastructure/repositories/dashboard.repositories';
import { DashboardDomainService } from './domain/services/dashboard-domain.service';
import { DashboardAbstract } from './application/dashboard.abstract';
import { DashboardRepoAbstract } from './domain/repositories/dashboard.repositories';

import {
  User,
  UserSchema,
} from 'src/modules/user/infrastructure/database/user.schema';
import {
  Post,
  PostSchema,
} from 'src/modules/post/infrastructure/database/post.schema';
import {
  Product,
  ProductSchema,
} from 'src/modules/product/infrastructure/database/product.schema';
import {
  BannerProduct,
  BannerProductSchema,
} from 'src/modules/banner/infrastructure/database/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Product.name, schema: ProductSchema },
      { name: BannerProduct.name, schema: BannerProductSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    DashboardDomainService,
    {
      provide: DashboardAbstract,
      useClass: DashboardService,
    },
    {
      provide: DashboardRepoAbstract,
      useClass: DashboardRepository,
    },
  ],
})
export class DashboardModule {}
