import { Secret, sign } from 'jsonwebtoken';
import { env } from '~/configs/env';
import { UserEntity } from '~/entities/user.entity';

export const createToken = (user: UserEntity) => {
  return sign(
    {
      userId: user.id
    },
    env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: '15m'
    }
  );
};
