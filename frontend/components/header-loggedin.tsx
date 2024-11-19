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
import { ShoppingCart, Bell, Search, User, BookOpen } from "lucide-react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged, signOut} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  username: string;
  avatar_url: string;
  learner_points: number;
  level: string;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserEmail(firebaseUser.email); // Store user email
      } else {
        setUserEmail(null);
        setUser(null); // Clear user data on logout
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data from the backend
  useEffect(() => {
    if (userEmail) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/courses/user/${userEmail}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUser({
            username: data.username || "New User",
            avatar_url: data.avatar_url || "/default-avatar.png",
            learner_points: data.learner_points || 0,
            level: data.level || "Beginner",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userEmail]);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/main")
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return <p className="text-center py-8">Fetching your profile...</p>;
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
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="rounded-full"
                    width={24}
                    height={24}
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
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
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
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
