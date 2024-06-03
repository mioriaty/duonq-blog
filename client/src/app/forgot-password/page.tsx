import { ForgotPasswordForm } from '@/app/forgot-password/__components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="w-full max-w-[400px]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
