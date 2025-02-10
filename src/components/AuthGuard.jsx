import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/session', { validateStatus: false });
        if (response.status === 200 && response.data.user) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          router.push('/LoginVeterinario');
        }
      } catch (error) {
        router.push('/LoginVeterinario');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthGuard;