/**
 * Auth callback page — handles Microsoft redirect after login
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import LoadingScreen from '../../components/ui/LoadingScreen';

function AuthCallbackPage() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the redirect response from Microsoft
    instance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          // Redirect to dashboard — AuthContext will handle token verification
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      })
      .catch((err) => {
        console.error('Auth callback error:', err);
        navigate('/login', { replace: true });
      });
  }, [instance, navigate]);

  return <LoadingScreen message="Completing sign-in…" />;
}

export default AuthCallbackPage;
