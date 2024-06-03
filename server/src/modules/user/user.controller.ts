import { StatusCodes } from 'http-status-codes';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '~/@types/context';
import { ChangePasswordInput } from '~/graphql/input-types/change-password-input';
import { ForgotPasswordInput } from '~/graphql/input-types/forgot-password-input';
import { LoginInput } from '~/graphql/input-types/login-input';
import { RegisterInput } from '~/graphql/input-types/register-input';
import { UserMutationResponse } from '~/graphql/response-types/user-mutation-response';
import { UserQueryResponse } from '~/graphql/response-types/user-query-response';
import { TokenModel } from '~/modules/token/token.model';
import { userService } from '~/modules/user/user.service';
import argon2 from 'argon2';
import { UserEntity } from '~/modules/user/user.entity';

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
    @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput
  ): Promise<UserMutationResponse> {
    if (changePasswordInput.newPassword.length <= 6) {
      return {
        code: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Password length must be greater than 6',
        error: [
          {
            field: 'newPassword',
            message: 'Password length must be greater than 6'
          }
        ]
      };
    }
    try {
      const resetPasswordRecord = await TokenModel.findOne({ userId });

      if (!resetPasswordRecord) {
        return {
          code: StatusCodes.NOT_FOUND,
          success: false,
          message: 'Invalid or expired token'
        };
      }
      const resetPasswordValid = await argon2.verify(resetPasswordRecord.token, token);

      if (!resetPasswordValid) {
        return {
          code: StatusCodes.UNAUTHORIZED,
          success: false,
          message: 'Invalid or expired token'
        };
      }

      const userIdInt = parseInt(userId);

      const user = await UserEntity.findOne({ where: { id: userIdInt } });

      if (!user) {
        return {
          code: StatusCodes.NOT_FOUND,
          success: false,
          message: 'User no longer exists'
        };
      }

      const updatedPassword = await argon2.hash(changePasswordInput.newPassword);

      await UserEntity.update({ id: userIdInt }, { password: updatedPassword });

      await TokenModel.deleteOne({ userId });

      return {
        code: StatusCodes.OK,
        success: true,
        message: 'Password changed successfully'
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
