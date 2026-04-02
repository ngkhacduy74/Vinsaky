import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductAbstract } from 'src/modules/product/application/product.abstract';

import { UserAbstract } from 'src/modules/user/application/user.abstract';
import { ProductController } from 'src/modules/product/presentation/product.controller';
import { UserController } from 'src/modules/user/presentation/user.controller';
import { ProductRepository } from 'src/modules/product/infrastructure/repositories/product.repositories';
import { UserRepository } from 'src/modules/user/infrastructure/repositories/user.repositories';
import {
  Product,
  ProductSchema,
} from 'src/modules/product/infrastructure/database/product.schema';
import {
  User,
  UserSchema,
} from 'src/modules/user/infrastructure/database/user.schema';
import { ProductService } from 'src/modules/product/application/product.service';
import { UserService } from 'src/modules/user/application/user.service';
import { AuthModule } from '../auth/auth.module';
import { PostService } from 'src/modules/post/application/post.service';
import { PostModule } from '../post/post.module';
import { ProductRepoAbstract } from 'src/modules/product/domain/repositories/product.repositories';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AuthModule,
    PostModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductRepository,
    {
      provide: ProductAbstract,
      useClass: ProductService,
    },
    {
      provide: ProductRepoAbstract,
      useClass: ProductRepository,
    },
  ],
  exports: [ProductAbstract, ProductRepository],
})
export class ProductModule {}
