import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';

interface ConfirmationFormProps {
  email: string;
  error: string;
  success: string;
  confirmationCode: string;
  isLoading: boolean;
  handleCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
  handleResendCode: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ email, error, success, confirmationCode, isLoading, handleCodeChange, handleConfirmSignUp, handleResendCode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirm Your Email</CardTitle>
          <CardDescription>
            We've sent a confirmation code to <strong>{email}</strong>. Please enter the code below to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-500 bg-green-100 p-3 rounded">
              {success}
            </div>
          )}
          <form onSubmit={handleConfirmSignUp}>
            <div className="space-y-4">
              <Input
                type="text"
                className="text-center"
                value={confirmationCode}
                onChange={handleCodeChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={isLoading}
                required
                style={{ letterSpacing: '0.5em', fontSize: '1.2em' }}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Confirming...' : 'Confirm Email'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button variant="link" onClick={handleResendCode} disabled={isLoading}>
            Didn't receive the code? Resend
          </Button>
          <Link to="/login" className="text-sm text-gray-600 hover:underline">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmationForm;
