import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  content!: string;
}
