import { COOKIE_NAME, __PROD__ } from '~/utils/constants';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { env } from '~/configs/env';

export const sessionMiddleware = session({
  name: COOKIE_NAME,
  store: MongoStore.create({
    mongoUrl: env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true, // JS ko thể access cookie
    secure: __PROD__, // chỉ gửi cookie nếu có https
    sameSite: 'lax' // csrf
  },
  secret: env.SESSION_SECRET!,
  saveUninitialized: true,
  resave: false // không lưu session nếu không có sự thay đổi
});
