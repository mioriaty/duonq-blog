import { Field, InterfaceType } from 'type-graphql';

@InterfaceType() // Định nghĩa một interface type để các mutation response entity khác kế thừa
export abstract class MutationResponseEntity {
  @Field()
  code!: number;

  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;
}
