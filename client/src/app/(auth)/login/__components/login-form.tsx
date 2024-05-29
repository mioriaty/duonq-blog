'use client';

import { ButtonLoading } from '@/shared/ButtonLoading';
import { PasswordInput } from '@/shared/PasswordInput';
import { LoadingSpinner } from '@/shared/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { MeDocument, MeQuery, useLoginMutation } from '@/generated/graphql';
import { mapFieldErrors } from '@/libs/helpers/map-field-errors';
import { useCheckAuth } from '@/libs/hooks/useCheckAuth';
import { LoginFormSchema } from '@/libs/types/schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function LoginForm() {
  const { loading: authLoading } = useCheckAuth();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      password: '',
      usernameOrEmail: ''
    }
  });

  const [registerUser, { loading }] = useLoginMutation();
  const navigate = useRouter();

  const onSubmit = (data: z.infer<typeof LoginFormSchema>) => {
    registerUser({
      variables: {
        loginInput: {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password
        }
      },
      update(cache, { data }) {
        if (data?.login.success && data.login.user) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                user: data.login.user,
                code: data.login.code,
                success: data.login.success,
                message: data.login.message,
                error: data.login.error
              }
            }
          });
        }

      },
      onCompleted(data) {
        if (data.login?.error) {
          const { field, message } = mapFieldErrors(data.login.error);

          form.setError(field as keyof z.infer<typeof LoginFormSchema>, {
            message
          });

          toast({
            title: 'duonqblog notification',
            variant: 'destructive',
            description: data.login.error[0].message
          });
        } else if (data.login.success && data.login.user) {
          toast({
            title: 'Welcome to duonqblog!',
            description: `${data.login.user.username}`,
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
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <ButtonLoading type="submit" isLoading={form.formState.isLoading || loading} className="w-full">
              Sign up
            </ButtonLoading>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
