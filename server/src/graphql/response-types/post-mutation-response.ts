import { Field, ObjectType } from 'type-graphql';
import { PostEntity } from '~/entities/post.entity';
import { MutationResponseEntity } from '~/graphql/abstract-types/mutation-response';
import { FieldError } from '~/graphql/response-types/field-error';

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
