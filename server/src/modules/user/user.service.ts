import argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';
import { Context } from '~/@types/context';
import { LoginInput } from '~/graphql/input-types/login-input';
import { UserMutationResponse } from '~/graphql/response-types/user-mutation-response';
import { userModel } from '~/modules/user/user.repository';

const login = async ({ password, usernameOrEmail, req }: LoginInput & Context): Promise<UserMutationResponse> => {
  const existingUser = await userModel.userExists({ usernameOrEmail });

  if (!existingUser) {
    return {
      code: StatusCodes.NOT_FOUND,
      success: false,
      message: 'Username or email not found',
      error: [
        {
          field: 'usernameOrEmail',
          message: 'Username or email not found'
        }
      ]
    };
  }

  const isPasswordValid = await argon2.verify(existingUser.password, password);

  if (!isPasswordValid) {
    return {
      code: StatusCodes.UNAUTHORIZED,
      success: false,
      message: 'Invalid password',
      error: [
        {
          field: 'password',
          message: 'Password does not match the user'
        }
      ]
    };
  }

  // set userId in request session
  req.session.userId = existingUser.id;

  return {
    code: StatusCodes.OK,
    success: true,
    message: 'User logged in',
    user: existingUser
  };
};

export const userService = { login };
