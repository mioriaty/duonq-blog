'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useForgetPasswordMutation } from '@/generated/graphql';
import { useCheckAuth } from '@/libs/hooks/useCheckAuth';
import { ForgotFormSchema } from '@/libs/types/schemas/forgot-password.schema';
import { ButtonLoading } from '@/shared/ButtonLoading';
import { LoadingSpinner } from '@/shared/Spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const ForgotPasswordForm: React.FC = () => {
  const { loading: authLoading } = useCheckAuth();
  const form = useForm<z.infer<typeof ForgotFormSchema>>({
    resolver: zodResolver(ForgotFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const [forgotPassword, { loading }] = useForgetPasswordMutation();

  const handleForgotPassword = (data: z.infer<typeof ForgotFormSchema>) => {
    forgotPassword({
      variables: {
        forgotPasswordInput: {
          email: data.email
        }
      },
      onCompleted(data) {
        console.log({ data });
      },
      onError(error) {
        form.setError('email' as keyof z.infer<typeof ForgotFormSchema>, {
          message: error.message
        });
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: error.message
        });
      }
    });
  };

  if (authLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleForgotPassword)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading type="submit" isLoading={form.formState.isLoading || loading} className="w-full">
              Send reset password
            </ButtonLoading>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
