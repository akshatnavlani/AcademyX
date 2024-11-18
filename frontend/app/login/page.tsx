'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
// import apple from '@/components/icons/icons8-apple 1.png';
import google from '@/components/icons/icons8-google 1.png';
import github from '@/components/icons/Github.png';
import { useState } from 'react';  // for managing state
import { useRouter } from 'next/navigation';  // for redirection
import { auth } from '@/lib/firebase';  // firebase auth import
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');  // Redirect on successful login
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
    }
  };

  // Handle GitHub Login
  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'GitHub login failed.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-4xl flex">
          <div className="w-full md:w-1/2 bg-white p-8 rounded-lg md:rounded-r-none md:rounded-l-lg">
            <h2 className="text-2xl font-bold mb-6">WELCOME BACK</h2>
            <p className="text-gray-600 mb-6">PLEASE ENTER YOUR DETAILS</p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-gray-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800" type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </form>
            <div className="mt-6 flex justify-center space-x-4">
              {/* Google Login */}
              <Button onClick={handleGoogleLogin} className="flex items-center space-x-2 w-full py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100">
                <Image src={google} alt="Google" width={24} height={24} />
                <span className='text-black'>Sign in with Google</span>
              </Button>

              {/* GitHub Login */}
              <Button onClick={handleGithubLogin} className="flex items-center space-x-2 w-full py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100">
                <Image src={github} alt="GitHub" width={24} height={24} />
                <span className='text-black'>Sign in with GitHub</span>
              </Button>

              {/* Apple Login (example for future) */}
              {/* <Button className="flex items-center space-x-2 w-full py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100">
                <Image src={apple} alt="Apple" width={24} height={24} />
                <span>Sign in with Apple</span>
              </Button> */}
            </div>
            <div className="mt-6 text-center">
              <Link href="/signup" className="text-sm text-gray-600 hover:underline">
                {"Don't have an account?"}
              </Link>
            </div>
          </div>
          <div className="w-1/2 bg-gray-200 rounded-r-lg hidden md:block">
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-500">Image placeholder</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
