// app/page.tsx (client-side redirect logic)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from './firebase/config';  // Using the getUser function from config.ts

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUser();
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/main');
      }
    };

    checkAuth();
  }, [router]);

  // return <div>Loading...</div>; // Optionally show a loading state while checking authentication
};

export default HomePage;
