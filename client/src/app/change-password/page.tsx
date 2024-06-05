import { ChangePasswordForm } from '@/app/change-password/__components/change-password-form';

export default function ChangePasswordPage() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="w-full max-w-[400px]">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
