"use client"

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CourseCard } from '@/components/course-card'
// import { Achievements } from '@/components/achievements'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Bell, Search, User, BookOpen, Upload } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState({
    name: "John Doe",
    level: "High Schooler",
    learnerPoints: 500,
    achievements: ["Course Creator", "Fast Learner", "Top Contributor"],
    accountType: "teacher" // or "student"
  })

  const enrolledCourses = [
    {
      id: "1",
      title: "Introduction to React",
      thumbnail: "/placeholder.svg?height=200&width=400",
      tags: ["Web Development", "JavaScript", "React"],
      completion: 78,
      instructor: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32"
      }
    },
    {
      id: "2",
      title: "Python for Beginners",
      thumbnail: "/placeholder.svg?height=200&width=400",
      tags: ["Programming", "Python", "Beginner"],
      completion: 45,
      instructor: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32"
      }
    }
  ]

  const createdCourses = [
    {
      id: "3",
      title: "Advanced Python Programming",
      thumbnail: "/placeholder.svg?height=200&width=400",
      tags: ["Programming", "Python", "Advanced"],
      rating: 4.8,
      instructor: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32"
      }
    },
    {
      id: "4",
      title: "Web Development Bootcamp",
      thumbnail: "/placeholder.svg?height=200&width=400",
      tags: ["Web Development", "HTML", "CSS", "JavaScript"],
      rating: 4.9,
      instructor: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32"
      }
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="font-semibold">{user.learnerPoints}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            {/* <Achievements 
              achievements={user.achievements}
              level={user.level}
              learnerPoints={user.learnerPoints}
            /> */}
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