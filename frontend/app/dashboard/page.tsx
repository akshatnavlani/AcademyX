"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
import { CourseCard } from '@/components/course-card'
import { Achievements } from '@/components/achievements'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload } from 'lucide-react'
import Link from 'next/link'

interface User {
  name: string;
  level: string;
  achievements: string[];
  accountType: string;
  coursesBought: { course_id: string, percentage_completed: number, number_of_videos_watched: number, course_title: string }[];
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
  const [user, setUser] = useState<User | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [createdCourses, setCreatedCourses] = useState<Course[]>([])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/me'); // Fetch logged-in user data from backend
      const data = await response.json();
      setUser(data);

      // Get the enrolled courses for the user
      const enrolledResponse = await fetch(`/api/courses/${data.coursesBought.map(course => course.course_id).join(',')}`);
      const enrolledData = await enrolledResponse.json();
      setEnrolledCourses(enrolledData);

      // Get the created courses for the teacher
      if (data.accountType === 'teacher') {
        const createdResponse = await fetch('/api/courses/created');
        const createdData = await createdResponse.json();
        setCreatedCourses(createdData);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])

  if (!user) return <div>Loading...</div>;

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
            {user.accountType === "teacher" && (
              <TabsTrigger value="teaching">Your Teaching</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="learning">
            <h2 className="text-2xl font-bold mb-6">Continue Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </TabsContent>
          {user.accountType === "teacher" && (
            <TabsContent value="teaching">
              <h2 className="text-2xl font-bold mb-6">Manage Your Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
