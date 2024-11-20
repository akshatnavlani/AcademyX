'use client'
import { useEffect, useState } from "react";
import { CourseCard } from "@/components/course-card"; // Assuming CourseCard is in the components folder

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
  };
  rating?: number;
  completion?: number;
}
const NEXT_URI = "http://localhost:5000/api/courses";
export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${NEXT_URI}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const coursesData = await response.json();
        setCourses(coursesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Explore Courses</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((course) => (
          <div key={course._id}>
            <CourseCard id={course._id} />
          </div>
        ))}
      </div>
    </div>
  );
}
