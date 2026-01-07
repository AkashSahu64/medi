import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { authService } from '../../services/auth.service';
import { useApi } from '../../hooks/useApi';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { execute: resetPassword, loading } = useApi(authService.resetPassword);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Error is handled by useApi hook
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | MEDIHOPE Physiotherapy</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white pt-20">
        <div className="container-padding py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            {!isSubmitted ? (
              <div className="card">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-2xl">M</span>
                  </div>
                  <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                    Set New Password
                  </h1>
                  <p className="text-secondary-600">
                    Create a new password for your MEDIHOPE account.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                        <FaLock />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
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
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                    <p className="mt-1 text-sm text-secondary-500">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                        <FaLock />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        className="w-full pl-12 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="lg"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-8 pt-6 border-t border-secondary-200">
                  <p className="text-secondary-600">
                    <Link
                      to="/login"
                      className="font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Back to login
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="card text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-4xl text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                  Password Reset Successful!
                </h1>
                
                <p className="text-secondary-600 mb-6">
                  Your password has been successfully reset. 
                  You will be redirected to the login page shortly.
                </p>

                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6"></div>

                <Link to="/login">
                  <Button fullWidth>
                    Go to Login
                  </Button>
                </Link>
              </div>
            )}

            {/* Security Note */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Tip:</strong> For your protection, this link will expire in 10 minutes. 
                If you need another reset link, please request a new one.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;