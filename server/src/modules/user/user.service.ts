import argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';
import { Context } from '~/@types/context';
import { LoginInput } from '~/graphql/input-types/login-input';
import { RegisterInput } from '~/graphql/input-types/register-input';
import { UserMutationResponse } from '~/graphql/response-types/user-mutation-response';
import { userModel } from '~/modules/user/user.repository';
import { COOKIE_NAME } from '~/utils/constants';
import { registerValidation } from '~/validations/register-validation';

const register = async ({ email, password, username, req }: RegisterInput & Context): Promise<UserMutationResponse> => {
  try {
    const validateRegister = registerValidation({ email, password, username });

    if (validateRegister !== null) {
      return {
        code: StatusCodes.BAD_REQUEST,
        success: false,
        ...validateRegister
      };
    }

    const existingUser = await userModel.userExists({ email, username });

    if (existingUser) {
      return {
        code: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Username or email already exists',
        error: [
          {
            field: existingUser.username === username ? 'username' : 'email',
            message: 'Username or email already taken'
          }
        ]
      };
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = await userModel.createUser({
      email,
      password: hashedPassword,
      username
    });

    req.session.userId = newUser.id;

    return {
      code: StatusCodes.OK,
      success: true,
      message: 'User created',
      user: newUser
    };
  } catch (error) {
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'An error occurred'
    };
  }
};

const login = async ({ password, usernameOrEmail, req }: LoginInput & Context): Promise<UserMutationResponse> => {
  try {
    const existingUser = await userModel.userExists(
      usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
    );

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
  } catch (error) {
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'An error occurred'
    };
  }
};

const logout = ({ req, res }: Context): Promise<UserMutationResponse> => {
  return new Promise((resolve) =>
    req.session.destroy((error) => {
      res.clearCookie(COOKIE_NAME);

      if (error) {
        resolve({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'An error occurred'
        });
      }
      resolve({
        code: StatusCodes.OK,
        success: true,
        message: 'Logout success'
      });
    })
  );
};

const me = async ({ req }: Context): Promise<UserMutationResponse> => {
  try {
    if (!req.session.userId) {
      return {
        code: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'Cookie is expired or not set'
      };
    }
    const user = await userModel.userExists({ id: req.session.userId });
    if (!user) {
      return {
        code: StatusCodes.NOT_FOUND,
        success: false,
        message: 'User not found'
      };
    }
    return {
      code: StatusCodes.OK,
      success: true,
      message: 'User found',
      user
    };
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
};

export const userService = { login, logout, register, me };
