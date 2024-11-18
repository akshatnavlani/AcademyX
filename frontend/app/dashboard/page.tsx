"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header-loggedin";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Achievements } from "@/components/achievements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import Link from "next/link";

interface User {
  name: string;
  level: string;
  achievements: string[];
  accountType: string;
  coursesBought: { course_id: string; percentage_completed: number; course_title: string }[];
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
  };
  completion: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/me");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setUser(data);

      if (data.coursesBought.length > 0) {
        const enrolledResponse = await fetch(`/api/courses/${data.coursesBought.map((course) => course.course_id).join(",")}`);
        const enrolledData = await enrolledResponse.json();
        setEnrolledCourses(
          enrolledData.map((course: any) => ({
            id: course._id,
            title: course.title,
            thumbnail: course.thumbnail,
            tags: course.tags,
            instructor: course.instructor,
            completion: data.coursesBought.find((c: any) => c.course_id === course._id)?.percentage_completed || 0,
          }))
        );
      }

      if (data.accountType === "teacher") {
        const createdResponse = await fetch("/api/courses/created");
        const createdData = await createdResponse.json();
        setCreatedCourses(
          createdData.map((course: any) => ({
            id: course._id,
            title: course.title,
            thumbnail: course.thumbnail,
            tags: course.tags,
            instructor: course.instructor,
            completion: 0, // Teachers don't have completion for their courses
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error loading user data</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <Achievements achievements={user.achievements} level={user.level} />
          </div>
          {user.accountType === "teacher" && (
            <div>
              <Button className="w-full" asChild>
                <Link href="/create-course">
                  <Upload className="mr-2 h-4 w-4" /> Create New Course
                </Link>
              </Button>
            </div>
          )}
        </div>
        <Tabs defaultValue="learning" className="mb-12">
          <TabsList>
            <TabsTrigger value="learning">Your Learning</TabsTrigger>
            {user.accountType === "teacher" && <TabsTrigger value="teaching">Your Teaching</TabsTrigger>}
          </TabsList>
          <TabsContent value="learning">
            <h2 className="text-2xl font-bold mb-6">Continue Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.length === 0 ? (
                <div>No courses enrolled yet. Start your learning journey today!</div>
              ) : (
                enrolledCourses.map((course) => <CourseCard key={course.id} {...course} />)
              )}
            </div>
          </TabsContent>
          {user.accountType === "teacher" && (
            <TabsContent value="teaching">
              <h2 className="text-2xl font-bold mb-6">Manage Your Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCourses.length === 0 ? (
                  <div>No courses created yet. Start teaching today!</div>
                ) : (
                  createdCourses.map((course) => <CourseCard key={course.id} {...course} />)
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
