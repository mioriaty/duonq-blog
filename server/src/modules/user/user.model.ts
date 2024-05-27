import { LoginInput } from '~/graphql/input-types/login-input';
import { UserEntity } from '~/modules/user/user.entity';

const login = async ({ usernameOrEmail }: Omit<LoginInput, 'password'>) => {
  try {
    const existingUser = await UserEntity.findOne({
      where: usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
    });
    return existingUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const userModel = { login };
