import { Field, ObjectType } from 'type-graphql';
import { UserEntity } from '~/entities/user.entity';
import { MutationResponseEntity } from '~/graphql/abstract-types/mutation-response';
import { FieldError } from '~/graphql/response-types/field-error';

@ObjectType({ implements: MutationResponseEntity })
export class UserMutationResponse implements MutationResponseEntity {
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
