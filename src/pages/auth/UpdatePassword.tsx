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
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
      setError("Password must be at least 8 characters long.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least 1 number.");
      setError("Password must contain at least 1 number.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least 1 lowercase letter.");
      setError("Password must contain at least 1 lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least 1 uppercase letter.");
      setError("Password must contain at least 1 uppercase letter.");
    }
    const specialCharPattern = /[^a-zA-Z0-9 ]/;
    if (!specialCharPattern.test(password)) {
      errors.push("Password must contain at least 1 special character or a space.");
      setError("Password must contain at least 1 special character or a space.");
    }
    return errors;
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (field === "new" || field === "confirm") {
      const newPassword = field === "new" ? value : passwords.new;
      const confirmPassword = field === "confirm" ? value : passwords.confirm;
      setError(newPassword && confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : "");
    }
  };
  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setIsLoading(true)
      await updatePassword({ oldPassword: passwords.old, newPassword: passwords.new });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setPasswords({ old: "", new: "", confirm: "" });
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError("Failed to update password. Please check your old password and try again.");
      console.error("Password update error:", err);
    }
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
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
                value={passwords.old}
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
                value={passwords.new}
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
                value={passwords.confirm}
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
