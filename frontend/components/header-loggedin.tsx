"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Bell, Search, User, BookOpen, ChevronDown } from "lucide-react"; // Include BookOpen icon
import { auth } from "@/lib/firebase"; // Firebase authentication import
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth function
import Image from "next/image"; // Import Next.js Image component

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  username: string;
  avatar_url: string;
  learner_points: number;
  level: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // To store the logged-in user's email
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state to handle user data fetching

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserEmail(firebaseUser.email); // Store email of logged-in user
      } else {
        setUserEmail(null); // User is not logged in
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchUserData = async () => {
        setIsLoading(true); // Set loading state to true when fetching user data
        try {
          const userResponse = await fetch(`${API_URL}/users/${userEmail}`);
          const userData = await userResponse.json();

          // If user data is not available (new user), create default values
          if (!userData) {
            setUser({
              username: "New User", // Placeholder username for new users
              avatar_url: "/default-avatar.png", // Default avatar image
              learner_points: 0, // New users have 0 learner points by default
              level: "Beginner", // Default level for new users
            });
          } else {
            // Set the fetched user data
            setUser({
              username: userData.username,
              avatar_url: userData.avatar_url,
              learner_points: userData.learner_points || 0, // Default to 0 if no learner points are available
              level: userData.level || "Beginner", // Default to "Beginner" if no level is available
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false); // Set loading state to false after data is fetched
        }
      };

      fetchUserData();
    }
  }, [userEmail]);

  if (isLoading) {
    return <p className="text-center py-8">Fetching your profile...</p>; // Show loading text while fetching data
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          ACADEMYX
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/explore" className="text-muted-foreground hover:text-primary">Explore</Link>
          <Link href="/teachers" className="text-muted-foreground hover:text-primary">Teachers</Link>
          <Link href="/resources" className="text-muted-foreground hover:text-primary">Resources</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">{user?.learner_points || 0}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
