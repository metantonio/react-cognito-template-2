import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import ConfirmationForm from "./ConfirmationForm";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface SignUpResult {
  isSignUpComplete: boolean;
  userId: string;
  nextStep: {
    signUpStep: string;
  };
}

const SignUpStep = {
  CONFIRM_SIGN_UP: "CONFIRM_SIGN_UP",
};

interface IForm {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
  address: string;
  phone: string;
  website: string;
  givenName: string;
  middleName: string;
  familyName: string;
  birthdate: string;
}

const Signup = () => {
  const [form, setForm] = useState<IForm>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    address: "",
    phone: "",
    website: "",
    givenName: "",
    middleName: "",
    familyName: "",
    birthdate:"",
  });
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationCode(e.target.value);
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      throw new Error("Username is required");
    }
    if (!form.email.trim()) {
      throw new Error("Email is required");
    }
    if (!form.password.trim()) {
      throw new Error("Password is required");
    }
    if (form.password !== form.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (form.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      throw new Error("Please enter a valid email address");
    }

    const usernameRegex = /^[a-zA-Z0-9_@.]+$/;
    if (!usernameRegex.test(form.username)) {
      throw new Error(
        "Username can only contain letters, numbers, and underscores, and @"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      validateForm();

      const { isSignUpComplete, nextStep }: SignUpResult = await signUp({
        username: form.username,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            website: form.website,
            address: form.address,
            phone_number: form.phone,
            given_name: form.givenName,
            family_name: form.familyName,
            middle_name: form.middleName,
            birthdate: form.birthdate,
            name: form.givenName
          },
        },
      });

      if (isSignUpComplete) {
        setSuccess("Account created successfully! You can now log in.");
        setTimeout(() => navigate("/adminpanel/login"), 2000);
      } else {
        if (nextStep.signUpStep === SignUpStep.CONFIRM_SIGN_UP) {
          setShowConfirmation(true);
          setSuccess(
            "Account created! Please check your email for the confirmation code."
          );
        }
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
       if (err instanceof Error) {
        setError(err.message || "Signup failed. Please try again.");
      } else {
        setError("An unknown error occurred during signup.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!confirmationCode.trim()) {
        throw new Error("Please enter the confirmation code");
      }

      const { isSignUpComplete } = await confirmSignUp({
        username: form.username,
        confirmationCode: confirmationCode.trim(),
      });

      if (isSignUpComplete) {
        setSuccess("Email confirmed successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: unknown) {
      console.error("Confirmation error:", err);
      if (err instanceof Error) {
        setError(
          err.message || "Confirmation failed. Please check the code and try again."
        );
      } else {
        setError("An unknown error occurred during confirmation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      await resendSignUpCode({
        username: form.username,
      });
      setSuccess("Confirmation code resent! Please check your email.");
    } catch (err: unknown) {
      console.error("Resend code error:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to resend code. Please try again.");
      } else {
        setError("An unknown error occurred while resending the code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <ConfirmationForm
        email={form.email}
        error={error}
        success={success}
        confirmationCode={confirmationCode}
        isLoading={isLoading}
        handleCodeChange={handleCodeChange}
        handleConfirmSignUp={handleConfirmSignUp}
        handleResendCode={handleResendCode}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account.
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="john_doe"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="givenName">Given Name</Label>
              <Input
                id="givenName"
                name="givenName"
                value={form.givenName}
                onChange={handleChange}
                placeholder="John"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                name="familyName"
                value={form.familyName}
                onChange={handleChange}
                placeholder="Doe"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                placeholder="Michael"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+15555555555"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St, Anytown, USA"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input
                id="birthdate"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                placeholder="01/01/1990"
                type="date"
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <small className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/adminpanel/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </small>
          <Link to="/adminpanel" className="text-sm text-gray-600 hover:underline">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
