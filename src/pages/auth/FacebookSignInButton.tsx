import React from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';

interface FacebookSignInButtonProps {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  isLoading: boolean;
}

const FacebookSignInButton: React.FC<FacebookSignInButtonProps> = ({ setIsLoading, setError, isLoading }) => {
  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithRedirect({
        provider: 'Facebook',
        customState: JSON.stringify({ returnUrl: '/adminpanel/users' })
      });
    } catch (error: unknown) {
      console.error('Facebook sign-in error:', error);
      if (error instanceof Error) {
        setError('Facebook sign-in failed: ' + error.message);
      } else {
        setError('An unknown error occurred during Facebook sign-in.');
      }
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleFacebookSignIn} disabled={isLoading}>
      {isLoading ? 'Redirecting...' : 'Login with Facebook'}
    </Button>
  );
};

export default FacebookSignInButton;
