import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { authService } from '../../services/auth.service';
import { useApi } from '../../hooks/useApi';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { execute: forgotPassword, loading } = useApi(authService.forgotPassword);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by useApi hook
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | MEDIHOPE Physiotherapy</title>
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
                    Forgot Password?
                  </h1>
                  <p className="text-secondary-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your registered email"
                    leftIcon={<FaEnvelope className="text-secondary-400" />}
                    error={errors.email?.message}
                    required
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address'
                      }
                    })}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="lg"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-8 pt-6 border-t border-secondary-200">
                  <p className="text-secondary-600">
                    Remember your password?{' '}
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
                  Check Your Email
                </h1>
                
                <p className="text-secondary-600 mb-6">
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong> Check your spam folder or try resending the link.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try Another Email
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="outline" fullWidth>
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-500">
                Need help? Contact us at{' '}
                <a href="mailto:support@medihope.com" className="text-primary-600">
                  support@medihope.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;