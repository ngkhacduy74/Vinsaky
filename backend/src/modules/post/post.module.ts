import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
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
import { BannerProduct, BannerProductSchema } from 'src/modules/banner/infrastructure/database/banner.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PostController } from 'src/modules/post/presentation/post.controller';
import { PostService } from 'src/modules/post/application/post.service';
import { PostRepository } from 'src/modules/post/infrastructure/repositories/post.repositories';
import { PostCommandService } from 'src/modules/post/domain/services/post-command.service';
import { PostInteractionService } from 'src/modules/post/domain/services/post-interaction.service';
import { PostAbstract } from 'src/modules/post/application/post.abstract';
import { PostRepoAbstract } from 'src/modules/post/domain/repositories/post.repositories';
import { PostDomainService } from 'src/modules/post/domain/services/post-domain.service';
import { PostQueryService } from 'src/modules/post/domain/services/post-query.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [
    PostRepository,
    PostService,
    PostCommandService,
    PostInteractionService,
    PostDomainService,
    PostQueryService,
    {
      provide: PostAbstract,
      useClass: PostService,
    },
    {
      provide: PostRepoAbstract,
      useClass: PostRepository,
    },
  ],
  exports: [PostAbstract, PostRepository],
})
export class PostModule {}
