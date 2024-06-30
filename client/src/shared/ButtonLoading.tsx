import { ReloadIcon } from '@radix-ui/react-icons';

import { Button, ButtonProps } from '@/components/ui/button';

interface ButtonLoadingProps extends ButtonProps {
  isLoading?: boolean;
}

export const ButtonLoading = ({ isLoading, children, ...props }: ButtonLoadingProps) => {
  return (
    <Button {...props} disabled={props.disabled || isLoading}>
      {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
