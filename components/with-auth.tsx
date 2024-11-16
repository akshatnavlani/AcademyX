import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';

export const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (router.pathname !== '/') router.push('/');
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (!isAuthenticated && router.pathname !== '/') return null;
    return <WrappedComponent {...props} />;
  };
};