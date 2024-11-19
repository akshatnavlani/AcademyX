'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header-loggedin';
import { Footer } from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { Achievements } from '@/components/achievements';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/app/firebase/config'; // Assuming Firebase is set up
const NEXT_URI = "http://localhost:5000/api/courses";

interface User {
  username: string;
  email: string;
  level: string;
  achievements: string[];
  account_type: string;
  learner_points: number;
  courses_bought: {
    course_id: string;
    percentage_completed: number;
    number_of_videos_watched: number;
    course_title: string;
  }[];
}

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
  };
  number_of_videos: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Track errors

  const fetchUserData = async (email: string): Promise<void> => {
    try {
      setError(null); // Reset previous errors
      const response = await fetch(`${NEXT_URI}/user/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data: User = await response.json();
      setUser(data);

      // Fetch enrolled courses if user has bought any
      if (data.courses_bought && data.courses_bought.length > 0) {
        const courseIds = data.courses_bought.map((course) => course.course_id).join(',');
        const enrolledResponse = await fetch(`${NEXT_URI}/${courseIds}`);

        if (!enrolledResponse.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const enrolledData: Course[] = await enrolledResponse.json();
        setEnrolledCourses(enrolledData);
      }

      // Fetch created courses for teachers
      if (data.account_type === 'teacher') {
        const createdResponse = await fetch(`${NEXT_URI}/created`);
        const createdData = await createdResponse.json();

        if (createdResponse.ok && Array.isArray(createdData.created_courses)) {
          setCreatedCourses(createdData.created_courses);
        } else {
          // If no courses are created, set the state to an empty array
          setCreatedCourses([]);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message); // Set the error message
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log(currentUser); // Check the logged-in user

      if (currentUser) {
        const email = currentUser.email;
        if (email) {
          fetchUserData(email);
        }
      }
      setLoading(false); // Set loading to false once the auth state is resolved
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading until Firebase Auth state is ready
  if (error) return <div>{`Error: ${error}`}</div>; // Display the error message if any
  if (!user) return <div>No user found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <Achievements achievements={user.achievements} level={user.level} />
          </div>
          {user.account_type === 'teacher' && (
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
            {user.account_type === 'teacher' && (
              <TabsTrigger value="teaching">Your Teaching</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="learning">
            <h2 className="text-2xl font-bold mb-6">Continue Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  thumbnail={course.thumbnail}
                  tags={course.tags}
                  instructor={course.instructor}
                  completion={course.number_of_videos ? course.number_of_videos * 100 : 0}
                />
              ))}
            </div>
          </TabsContent>
          {user.account_type === 'teacher' && (
            <TabsContent value="teaching">
              <h2 className="text-2xl font-bold mb-6">Manage Your Courses</h2>
              {createdCourses.length === 0 ? (
                <p>No courses created yet. Start by creating your first course!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      id={course._id}
                      title={course.title}
                      thumbnail={course.thumbnail}
                      tags={course.tags}
                      instructor={course.instructor}
                      completion={course.number_of_videos ? course.number_of_videos * 100 : 0}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                thumbnail={course.thumbnail}
                tags={course.tags}
                instructor={course.instructor}
                completion={course.number_of_videos ? course.number_of_videos * 100 : 0}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
