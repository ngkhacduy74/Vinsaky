import { IsEnum } from 'class-validator';
import { PostCondition } from 'src/modules/post/infrastructure/database/post.schema';

export class ChangePostConditionDto {
  @IsEnum(PostCondition)
  condition: PostCondition;
}
