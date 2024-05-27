import { Field, ObjectType } from 'type-graphql';
import { MutationResponseEntity } from '~/graphql/abstract-types/mutation-response';
import { FieldError } from '~/graphql/response-types/field-error';
import { UserEntity } from '~/modules/user/user.entity';

@ObjectType({ implements: MutationResponseEntity })
export class UserQueryResponse implements MutationResponseEntity {
  code!: number;
  success!: boolean;
  message?: string;

  @Field({ nullable: true })
  user?: UserEntity;

  @Field({ nullable: true })
  accessToken?: string;

  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];
}
