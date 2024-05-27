import { Field, ObjectType } from 'type-graphql';
import { MutationResponseEntity } from '~/graphql/abstract-types/mutation-response';
import { FieldError } from '~/graphql/response-types/field-error';
import { PostEntity } from '~/modules/post/post.entity';

@ObjectType({ implements: MutationResponseEntity })
export class PostMutationResponse implements MutationResponseEntity {
  code!: number;
  success!: boolean;
  message?: string;

  @Field({ nullable: true })
  post?: PostEntity;

  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];
}
