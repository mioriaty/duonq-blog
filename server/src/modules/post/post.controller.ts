import { StatusCodes } from 'http-status-codes';
import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { CreatePostInput } from '~/graphql/input-types/create-post-input';
import { UpdatePostInput } from '~/graphql/input-types/update-post-input';
import { PostMutationResponse } from '~/graphql/response-types/post-mutation-response';
import { checkGraphQLAuthMiddleware } from '~/middlewares/graphql-auth.middleware';
import { PostEntity } from '~/modules/post/post.entity';

@Resolver()
export class PostController {
  @Query(() => [PostEntity])
  async posts(): Promise<PostEntity[]> {
    try {
      return await PostEntity.find();
    } catch (error) {
      return [];
    }
  }

  @Query(() => PostMutationResponse)
  async post(@Arg('id', () => ID) id: number): Promise<PostMutationResponse> {
    try {
      const post = await PostEntity.findOne({ where: { id } });
      if (!post) {
        return {
          code: StatusCodes.NOT_FOUND,
          success: false,
          message: 'Post not found'
        };
      }
      return {
        code: StatusCodes.OK,
        success: true,
        message: 'Post found',
        post
      };
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkGraphQLAuthMiddleware)
  async createPost(@Arg('createPostInput') { title, content }: CreatePostInput): Promise<PostMutationResponse> {
    try {
      const newPost = PostEntity.create({ content, title });

      await newPost.save();

      return {
        code: StatusCodes.OK,
        success: true,
        message: 'Post created successfully',
        post: newPost
      };
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkGraphQLAuthMiddleware)
  async updatePost(@Arg('updatePostInput') { content, id, title }: UpdatePostInput): Promise<PostMutationResponse> {
    try {
      const existingPost = await PostEntity.findOne({ where: { id } });
      if (!existingPost) {
        return {
          code: StatusCodes.NOT_FOUND,
          success: false,
          message: 'Post not found'
        };
      }

      existingPost.content = content;
      existingPost.title = title;

      await existingPost.save();

      return {
        code: StatusCodes.OK,
        success: true,
        message: 'Post updated successfully',
        post: existingPost
      };
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkGraphQLAuthMiddleware)
  async deletePost(@Arg('id', () => ID) id: number): Promise<PostMutationResponse> {
    try {
      const post = await PostEntity.findOne({ where: { id } });
      if (!post) {
        return {
          code: StatusCodes.NOT_FOUND,
          success: false,
          message: 'Post not found'
        };
      }

      await PostEntity.delete({ id });

      return {
        code: StatusCodes.OK,
        success: true,
        message: 'Post deleted successfully'
      };
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }
}
