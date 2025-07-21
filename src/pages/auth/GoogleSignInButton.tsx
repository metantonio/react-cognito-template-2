import React from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';

interface GoogleSignInButtonProps {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  isLoading: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ setIsLoading, setError, isLoading }) => {
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithRedirect({
        provider: 'Google',
        customState: JSON.stringify({ returnUrl: '/adminpanel/users' })
      });
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      if (error instanceof Error) {
        setError('Google sign-in failed: ' + error.message);
      } else {
        setError('An unknown error occurred during Google sign-in.');
      }
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? 'Redirecting...' : 'Login with Google'}
    </Button>
  );
};

export default GoogleSignInButton;
