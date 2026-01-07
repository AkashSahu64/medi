import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    console.log('🔍 Form submitted with:', data);
    setIsLoading(true);
    
    try {
      const userData = await login(data);
      console.log('✅ Login successful, user data:', userData);
      
      // Check user role and redirect accordingly
      if (userData?.role === 'admin') {
        console.log('🔄 Redirecting to admin dashboard');
        navigate('/admin', { replace: true });
      } else {
        console.log('🔄 Redirecting to:', from);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('❌ Login error in component:', error);
      // Error is handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth redirect
    toast.loading('Redirecting to Google...');
    window.location.href = '/api/auth/google';
  };

  return (
    <>
      <Helmet>
        <title>Login | MEDIHOPE Physiotherapy</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white pt-20">
        <div className="container-padding py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            {/* Login Card */}
            <div className="card">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-2xl">M</span>
                </div>
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-secondary-600">
                  Sign in to your MEDIHOPE account
                </p>
              </div>

              {/* Google Login Button */}
              <button
                type="button"  // ✅ Add type="button" to prevent form submission
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 py-3 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors mb-6"
              >
                <FaGoogle className="text-red-500" />
                <span className="font-medium">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<FaEnvelope className="text-secondary-400" />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address'
                    }
                  })}
                />

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                      <FaLock />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button
                      type="button"  // ✅ Add type="button" to prevent form submission
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  <div className="text-right mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  size="lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-8 pt-6 border-t border-secondary-200">
                <p className="text-secondary-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Sign up now
                  </Link>
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            {/* Guest Option */}
            <div className="text-center mt-6">
              <p className="text-secondary-600">
                Want to book as guest?{' '}
                <Link
                  to="/appointment"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  Book appointment without login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;