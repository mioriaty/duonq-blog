'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useForgetPasswordMutation } from '@/generated/graphql';
import { ForgotFormSchema } from '@/libs/types/schemas/forgot-password.schema';
import { ButtonLoading } from '@/shared/ButtonLoading';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const ForgotPasswordForm: React.FC = () => {
  const form = useForm<z.infer<typeof ForgotFormSchema>>({
    resolver: zodResolver(ForgotFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const [forgotPassword, { loading }] = useForgetPasswordMutation();
  const navigate = useRouter();

  const handleForgotPassword = (data: z.infer<typeof ForgotFormSchema>) => {
    forgotPassword({
      variables: {
        forgotPasswordInput: {
          email: data.email
        }
      },
      onCompleted(data) {
        console.log({ data });

        // if (data.login?.error) {
        //   const { field, message } = mapFieldErrors(data.login.error);
        //   form.setError(field as keyof z.infer<typeof ForgotFormSchema>, {
        //     message
        //   });
        //   toast({
        //     title: 'duonqblog notification',
        //     variant: 'destructive',
        //     description: data.login.error[0].message
        //   });
        // } else if (data.login.success && data.login.user) {
        //   toast({
        //     title: 'Welcome to duonqblog!',
        //     description: `${data.login.user.username}`,
        //     duration: 3000
        //   });
        //   navigate.push('/');
        // }
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
