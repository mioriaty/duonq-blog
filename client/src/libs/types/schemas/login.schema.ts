import * as z from 'zod';

export const LoginFormSchema = z.object({
  usernameOrEmail: z.string().min(3),
  password: z.string().min(6)
});
