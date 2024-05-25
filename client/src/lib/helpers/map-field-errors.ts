import { FieldError } from '@/generated/graphql';

// returns object { field: string, message: string }
export const mapFieldErrors = (error: FieldError[]) => {
  return {
    field: error[0].field,
    message: error[0].message
  };
};
