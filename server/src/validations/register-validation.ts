import { RegisterInput } from '~/graphql/input-types/register-input';
import { FieldError } from '~/graphql/response-types/field-error';

export const registerValidation = ({
  email,
  password,
  username
}: RegisterInput): { message: string; errors: FieldError[] } | null => {
  if (!email.includes('@')) {
    return {
      message: 'Invalid email',
      errors: [
        {
          field: 'email',
          message: 'Invalid email'
        }
      ]
    };
  }

  if (username.length <= 2) {
    return {
      message: 'Username must be greater than 2 characters',
      errors: [
        {
          field: 'username',
          message: 'Username must be greater than 2 characters'
        }
      ]
    };
  }

  if (username.includes('@')) {
    return {
      message: 'Username cannot include an @ symbol',
      errors: [
        {
          field: 'username',
          message: 'Username cannot include an @ symbol'
        }
      ]
    };
  }

  if (password.length <= 6) {
    return {
      message: 'Password must be greater than 6 characters',
      errors: [
        {
          field: 'password',
          message: 'Password must be greater than 6 characters'
        }
      ]
    };
  }

  return null;
};
