import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { signIn, getCurrentUser, fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { AuthNextSignInStep, AuthSignInResult } from 'aws-amplify/auth';

type FormState = {
  username: string;
  password: string;
};

const Login = () => {
  const { login, logout } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState<FormState>({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [enableRedirect, setEnableRedirect] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just navigate to the main app
    navigate('/adminpanel');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please fill in all fields');
      }

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      }) as AuthSignInResult;

      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;
        //console.log("currentUser: ", currentUser)
        //console.log("session: ", session)

        const userAttributes = await fetchUserAttributes();
        if (userAttributes) {
          const name = userAttributes.given_name || ""; // Or userAttributes.given_name, userAttributes.family_name
          console.log("userAttributes: ", userAttributes);
        }

        if (!idToken) {
          throw new Error('No ID token found in session');
        }

        await login(currentUser, idToken.toString(), userAttributes);

        const redirectUrl = idToken.payload.website || currentUser.signInDetails?.loginId || '';

        if (redirectUrl && enableRedirect) {
          let absoluteUrl = `${redirectUrl}/?code=${idToken.payload.jti}`;
          if (redirectUrl.includes('.') && !redirectUrl.includes('://')) {
            absoluteUrl = `https://${redirectUrl}/?code=${idToken.payload.jti}`;
          }

          if (isValidUrl(absoluteUrl)) {
            window.location.href = absoluteUrl;
          } else {
            navigate('/adminpanel');
          }
        }
      } else {
        handleAuthNextStep(nextStep);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } else {
        setError('An unknown error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthNextStep = (nextStep: AuthNextSignInStep) => {
    switch (nextStep.signInStep) {
      case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
        setError('New password required. Please contact support.');
        break;
      case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
        setError('MFA code required. Please implement MFA flow.');
        break;
      case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
        setError('SMS verification required. Please implement SMS flow.');
        break;
      default:
        setError('Additional verification required.');
    }
  };

  useEffect(() => {
    const handleOAuthResponse = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescriptionParam = urlParams.get('error_description');

        if (errorParam || errorDescriptionParam) {
          setError(`Social sign-in failed: ${errorDescriptionParam || errorParam}. Please check your browser's pop-up blocker or try again later.`);
          setIsLoading(false);
          // Clear the error parameters from the URL to prevent re-triggering
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          return;
        }

        const user = await getCurrentUser();
        if (user) {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;
          const userAttributes = await fetchUserAttributes();
          const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
          //console.log('User groups:', groups);

          if (!idToken) {
            throw new Error('No ID token found in session');
          }

          await login(user, idToken.toString(), userAttributes);

          const state = urlParams.get('state');
          if (state) {
            try {
              const parsedState = JSON.parse(decodeURIComponent(state));
              navigate(parsedState.returnUrl || '/adminpanel');
            } catch {
              navigate('/adminpanel/login');
            }
          } else {
            navigate('/adminpanel'); // Default redirect after successful login
          }
        }
      } catch (error) {
        console.log('No authenticated user found or OAuth response error:', error);
        // This catch block is for initial load, not necessarily a failed login attempt
        // If it's a real error, it should be caught by the errorParam check above
      }
    };

    handleOAuthResponse();
  }, [login, navigate, setError, setIsLoading]);


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy-600">Welcome </h1>
            <p className="text-gray-600 mt-2">Sign in to your CasinoVizion account</p>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        handleChange(e)
                      }}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-navy-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div> */}

              {/* <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter
                  </Button>
                </div> 
              </div> */}

              {/* <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a ="#" className="text-navy-600 hover:underline">
                  Sign up
                </a>
              </p> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Animation */}
      <div className="flex-1 casino-gradient flex items-center justify-center p-8 relative overflow-hidden">
        <div className="text-center text-white z-10">
          <div className="relative">
            {/* Animated Casino Elements */}
            <div className="mb-6">
              <img
                src="/casino-vision-uploads/casino-logo.png" // ⬅️ Replace with actual logo path
                alt="CasinoVizion Logo"
                className="h-24 w-24 mx-auto"
              />
            </div>

            <h2 className="text-4xl font-bold mb-4">CasinoVizion</h2>
            <p className="text-xl mb-8 opacity-90">
              Professional Casino Management Platform
            </p>

            {/* Floating Cards Animation */}
            <div className="relative h-32">
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 animate-pulse">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-maroon-600 transform rotate-12">
                  A♥
                </div>
              </div>
              <div className="absolute left-1/2 top-4 transform -translate-x-1/2 animate-pulse delay-1000">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-red-600 transform -rotate-12">
                  K♥
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-casino-gold opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 -right-20 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-casino-gold opacity-5 rounded-full animate-pulse delay-1500"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="border border-white animate-pulse"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;