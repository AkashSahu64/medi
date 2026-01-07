import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus } = useAuth();

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      if (error) {
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (token) {
        // Store token and redirect
        localStorage.setItem('token', token);
        await checkAuthStatus();
        toast.success('Login successful!');
        
        // Redirect to previous page or home
        const from = localStorage.getItem('from') || '/';
        localStorage.removeItem('from');
        navigate(from);
      } else {
        toast.error('No authentication token found');
        navigate('/login');
      }
    } catch (err) {
      console.error('Auth callback error:', err);
      toast.error('Authentication failed');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center max-w-md mx-auto px-4">
        {error ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-4xl text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {error === 'access_denied' 
                ? 'Access was denied. Please try again.'
                : 'Something went wrong during authentication.'}
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Successful
            </h1>
            <p className="text-gray-600 mb-6">
              You are being redirected to your account...
            </p>
          </>
        )}
        <Loader size="lg" />
        <p className="text-sm text-gray-500 mt-6">
          If you are not redirected automatically,{' '}
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            click here
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;