'use client';

import { ButtonLoading } from '@/shared/ButtonLoading';
import { PasswordInput } from '@/shared/PasswordInput';
import { LoadingSpinner } from '@/shared/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { MeDocument, MeQuery, useRegisterMutation } from '@/generated/graphql';
import { mapFieldErrors } from '@/libs/helpers/map-field-errors';
import { useCheckAuth } from '@/libs/hooks/useCheckAuth';
import { RegisterFormSchema } from '@/libs/types/schemas/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function RegisterForm() {
  const { loading: authLoading } = useCheckAuth();
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    }
  });

  const [registerUser, { loading }] = useRegisterMutation();
  const navigate = useRouter();

  const onSubmit = (data: z.infer<typeof RegisterFormSchema>) => {
    registerUser({
      variables: {
        registerInput: {
          password: data.password,
          username: data.username,
          email: data.email
        }
      },
      update(cache, { data }) {
        // const meData = cache.readQuery({ query: MeDocument });
        if (data?.register.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                user: data.register.user,
                code: data.register.code,
                success: data.register.success
              }
            }
          });
        }
      },
      onCompleted(data) {
        if (data.register?.error) {
          const { field, message } = mapFieldErrors(data.register.error);

          form.setError(field as keyof z.infer<typeof RegisterFormSchema>, {
            message
          });

          toast({
            title: 'duonqblog notification',
            variant: 'destructive',
            description: data.register.error[0].message
          });
        }
        if (data.register.success && data.register.user) {
          toast({
            title: 'Welcome to duonqblog!',
            description: `${data.register.user.username}`,
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
        <CardTitle>Register</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="...@gmail.com" />
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
              Sign in
            </ButtonLoading>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
