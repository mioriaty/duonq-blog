import { UserEntity } from '~/modules/user/user.entity';

const userExists = async ({ email, username, id }: { username?: string; email?: string; id?: number }) => {
  const existingUser = await UserEntity.findOne({
    where: {
      email,
      username,
      id
    }
  });
  return existingUser;
};

const createUser = async ({ username, email, password }: { username: string; email: string; password: string }) => {
  const newUser = UserEntity.create({ username, email, password });
  await newUser.save();

  return newUser;
};

export const userModel = { userExists, createUser };
