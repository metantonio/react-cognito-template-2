import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'aws-amplify/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least 1 number.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least 1 lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least 1 uppercase letter.");
    }
    const specialCharPattern = /[^a-zA-Z0-9 ]/;
    if (!specialCharPattern.test(password)) {
      errors.push("Password must contain at least 1 special character or a space.");
    }
    return errors;
  };

  const handlePasswordChange = (field: string, value: string) => {
    if (field === "old") {
      setOldPassword(value);
    }
    else if (field === "new") {
      setNewPassword(value);
      const errors = validatePassword(value);
      if (errors.length > 0) {
        setPasswordError(errors.join(" "));
      }
      else if (confirmPassword && value === confirmPassword) {
        setPasswordError("");
      }
      else if (confirmPassword && value !== confirmPassword) {
        setPasswordError("Passwords do not match.");
      }
      else {
        setPasswordError("");
      }
    }
    else if (field === "confirm") {
      setConfirmPassword(value);
      if (newPassword !== value) {
        setPasswordError("Passwords do not match.");
      }
      else {
        const errors = validatePassword(newPassword);
        if (errors.length > 0) {
          setPasswordError(errors.join(" "));
        }
        else {
          setPasswordError("");
        }
      }
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setPasswordError(validationErrors.join(" "));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword({ oldPassword: oldPassword, newPassword: newPassword });
      toast({
        title: "Password Updated Successfully",
        description: "Your password has been changed successfully.",
      });
      navigate('/adminpanel/login');
    }
    catch (err) {
      console.error('Password update error:', err);
      setError("Failed to update password. Please check your old password and try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Set a New Password</CardTitle>
          <CardDescription className="text-center">
            A new password is required for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => handlePasswordChange("old", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => handlePasswordChange("new", e.target.value)}
                required
                disabled={isLoading}
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || passwordError !== '' || !oldPassword || !newPassword || !confirmPassword}>
              {isLoading ? 'Updating...' : 'Set New Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
