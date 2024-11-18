'use client';  // Add the "use client" directive

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Import from next/navigation instead of next/router
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import image from "@/components/icons/Learn Programming 1.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from 'lucide-react';
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";

import google from "@/components/icons/icons8-google 1.png";  // Import Google icon
import github from "@/components/icons/Github.png";  // Import GitHub icon

export default function SignUp() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();  // Use the client-side router from next/navigation

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // Send data to backend to save user to MongoDB
      const userData = {
        username: name,
        mail: email,
        account_type: isTeacher ? "teacher" : "student",
        learner_points: 0,
        level: "Beginner",
        achievements: [],
        courses_bought: [],
      };

      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to save user in the database.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create an account. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google SignUp
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Update the profile on Firebase
      await updateProfile(user, { displayName: user.displayName });
  
      // Send user data to backend to save in MongoDB
      const userData = {
        username: user.displayName,
        mail: user.email,
        account_type: "student", // You can customize this based on user info
        learner_points: 0,
        level: "Beginner",
        achievements: [],
        courses_bought: [],
      };
  
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to save user in the database.");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-up failed.");
      console.error(err);
    }
  };
  

  // Handle GitHub SignUp
  const handleGithubSignup = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await updateProfile(user, { displayName: user.displayName });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "GitHub sign-up failed.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [isSuccess, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl flex">
          <div className="w-1/2 rounded-r-lg hidden md:block">
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-500">
                <Image src={image} alt="Learn Programming" />
              </span>
            </div>
          </div>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Sign up for AcademyX</CardTitle>
              <CardDescription className="text-center">Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
                  <p className="text-lg font-semibold text-green-600">Successfully signed up!</p>
                  <p>Redirecting to dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-1"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      className="mt-1"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teacher"
                      checked={isTeacher}
                      onCheckedChange={(checked) => setIsTeacher(checked as boolean)}
                    />
                    <Label htmlFor="teacher">Sign up as a teacher</Label>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Sign up"}
                  </Button>
                </form>
              )}
            </CardContent>

            {/* Social login buttons */}
            <div className="flex justify-between p-4">
              <Button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
              >
                <Image src={google} alt="Google" width={24} height={24} />
                <span className="ml-2 text-black">Sign up with Google</span>
              </Button>
              <Button
                type="button"
                onClick={handleGithubSignup}
                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
              >
                <Image src={github} alt="GitHub" width={24} height={24} />
                <span className="ml-2 text-black">Sign up with GitHub</span>
              </Button>
            </div>

            <CardFooter className="flex justify-center p-1">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
