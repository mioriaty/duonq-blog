'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

import { useChangePasswordMutation } from '@/generated/graphql';
import { mapFieldErrors } from '@/libs/helpers/map-field-errors';
import { useCheckAuth } from '@/libs/hooks/useCheckAuth';
import { ChangePasswordFormSchema } from '@/libs/types/schemas/change-password.schema';
import { ButtonLoading } from '@/shared/ButtonLoading';
import { PasswordInput } from '@/shared/PasswordInput';
import { LoadingSpinner } from '@/shared/Spinner';

export function ChangePasswordForm() {
  const { loading: authLoading } = useCheckAuth();
  const form = useForm<z.infer<typeof ChangePasswordFormSchema>>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  const [changePassword, { loading }] = useChangePasswordMutation();
  const navigate = useRouter();
  const params = useSearchParams();

  const handleChangePassword = (data: z.infer<typeof ChangePasswordFormSchema>) => {
    const userId = params.get('userId');
    const token = params.get('token');

    if (!userId || !token) {
      toast({
        title: 'duonqblog notification',
        variant: 'destructive',
        description: 'Invalid link'
      });
      return;
    }

    changePassword({
      variables: {
        userId,
        changePasswordInput: { newPassword: data.password },
        token
      },
      onCompleted(data) {
        if (data.changePassword?.error) {
          const { field, message } = mapFieldErrors(data.changePassword.error);

          form.setError(field as keyof z.infer<typeof ChangePasswordFormSchema>, {
            message
          });

          toast({
            title: 'Go back to forgot password page!',
            variant: 'destructive',
            description: data.changePassword.error[0].message
          });
          navigate.push('/forgot-password');
        }
        if (data.changePassword.success && data.changePassword.user) {
          toast({
            title: 'Welcome to duonqblog!',
            description: `${data.changePassword.user.username}`,
            duration: 3000
          });
          navigate.push('/');
        }
      },
      onError(error) {
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
        <CardTitle>Change password</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirmation</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading type="submit" isLoading={form.formState.isLoading || loading} className="w-full">
              Change password
            </ButtonLoading>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
