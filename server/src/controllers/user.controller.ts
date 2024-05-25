import argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '~/@types/context';
import { UserEntity } from '~/entities/user.entity';
import { LoginInput } from '~/graphql/input-types/login-input';
import { RegisterInput } from '~/graphql/input-types/register-input';
import { UserMutationResponse } from '~/graphql/response-types/user-mutation-response';
import { UserQueryResponse } from '~/graphql/response-types/user-query-response';
import { COOKIE_NAME } from '~/utils/constants';
import { registerValidation } from '~/validations/register-validation';

@Resolver()
export class UserController {
  @Query(() => UserQueryResponse)
  async me(@Ctx() { req }: Context): Promise<UserQueryResponse> {
    try {
      if (!req.session.userId) {
        return {
          code: StatusCodes.UNAUTHORIZED,
          success: false,
          message: 'Cookie is expired or not set'
        };
      }
      const user = await UserEntity.findOne({ where: { id: req.session.userId } });
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
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async register(
    @Arg('registerInput') { email, password, username }: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const validateRegister = registerValidation({ email, password, username });

    if (validateRegister !== null) {
      return {
        code: StatusCodes.BAD_REQUEST,
        success: false,
        ...validateRegister
      };
    }

    try {
      const existingUser = await UserEntity.findOne({
        where: [{ username }, { email }]
      });
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
      const newUser = UserEntity.create({ username, email, password: hashedPassword });
      await newUser.save();

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
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg('loginInput') { password, usernameOrEmail }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await UserEntity.findOne({
        where: usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
      });

      if (!existingUser) {
        return {
          code: StatusCodes.BAD_REQUEST,
          success: false,
          message: 'User not found',
          error: [
            {
              field: 'usernameOrEmail',
              message: 'User not found'
            }
          ]
        };
      }

      const isPasswordValid = await argon2.verify(existingUser.password, password);

      if (!isPasswordValid) {
        return {
          code: StatusCodes.BAD_REQUEST,
          success: false,
          message: 'Password does not match the user',
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
        message: 'Login success',
        user: existingUser
      };
    } catch (error) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'An error occurred'
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async logout(@Ctx() { req, res }: Context): Promise<UserMutationResponse> {
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
  }
}
