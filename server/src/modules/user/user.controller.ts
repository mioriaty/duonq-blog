import { StatusCodes } from 'http-status-codes';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '~/@types/context';
import { ChangePasswordInput } from '~/graphql/input-types/change-password-input';
import { ForgotPasswordInput } from '~/graphql/input-types/forgot-password-input';
import { LoginInput } from '~/graphql/input-types/login-input';
import { RegisterInput } from '~/graphql/input-types/register-input';
import { UserMutationResponse } from '~/graphql/response-types/user-mutation-response';
import { UserQueryResponse } from '~/graphql/response-types/user-query-response';
import { userService } from '~/modules/user/user.service';

@Resolver()
export class UserController {
  @Query(() => UserQueryResponse)
  async me(@Ctx() context: Context): Promise<UserQueryResponse> {
    try {
      return userService.me(context);
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred',
        error: [
          {
            field: 'server',
            message: (error as Error).message
          }
        ]
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async register(
    @Arg('registerInput') { email, password, username }: RegisterInput,
    @Ctx() { req, res }: Context
  ): Promise<UserMutationResponse> {
    try {
      return userService.register({ email, password, username, req, res });
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg('loginInput') { password, usernameOrEmail }: LoginInput,
    @Ctx() { req, res }: Context
  ): Promise<UserMutationResponse> {
    try {
      return userService.login({ password, usernameOrEmail, req, res });
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async logout(@Ctx() context: Context): Promise<UserMutationResponse> {
    return userService.logout(context);
  }

  @Mutation(() => UserMutationResponse)
  async forgotPassword(@Arg('forgotPasswordInput') { email }: ForgotPasswordInput): Promise<UserMutationResponse> {
    try {
      return userService.forgotPassword({ email });
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('userId') userId: string,
    @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @Ctx() context: Context
  ): Promise<UserMutationResponse> {
    try {
      return userService.changePassword({ token, userId, newPassword: changePasswordInput.newPassword, context });
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }
}
