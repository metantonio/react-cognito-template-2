import React from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';

interface AppleSignInButtonProps {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  isLoading: boolean;
}

const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({ setIsLoading, setError, isLoading }) => {
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithRedirect({
        provider: 'Apple',
        customState: JSON.stringify({ returnUrl: '/adminpanel/users' })
      });
    } catch (error: unknown) {
      console.error('Apple sign-in error:', error);
      if (error instanceof Error) {
        setError('Apple sign-in failed: ' + error.message);
      } else {
        setError('An unknown error occurred during Apple sign-in.');
      }
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleAppleSignIn} disabled={isLoading}>
      {isLoading ? 'Redirecting...' : 'Login with Apple'}
    </Button>
  );
};

export default AppleSignInButton;
