import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthGuard = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);  // Stato per tenere traccia del ruolo dell'utente
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/session', { validateStatus: false });
        if (response.status === 200 && response.data.user) {
          setIsAuthenticated(true);
          setUserRole(response.data.user.role);
        } else if (response.status === 401) {
          router.push('/');
        }
      } catch (error) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Controlla se l'utente ha il ruolo giusto per accedere alla pagina
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    router.push('/access-denied');  // Reindirizza a una pagina di accesso negato se il ruolo non è autorizzato
    return null;
  }

  return children;
};

export default AuthGuard;
