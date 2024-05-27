import { LoginInput } from '~/graphql/input-types/login-input';
import { UserEntity } from '~/modules/user/user.entity';

const userExists = async ({ usernameOrEmail }: Omit<LoginInput, 'password'>) => {
  const existingUser = await UserEntity.findOne({
    where: usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
  });
  return existingUser;
};

export const userModel = { userExists };
