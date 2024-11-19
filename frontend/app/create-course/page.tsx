'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'

interface TopicType {
  title: string
  content: string
  videoUrl: string
  videoFile: File | null
  videoThumbnail: string | null
}

interface ChapterType {
  title: string
  topics: TopicType[]
}

export default function CreateCourse() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: '',
    tags: '',
    thumbnail: null,
  })
  const [chapters, setChapters] = useState<ChapterType[]>([{
    title: '',
    topics: [{
      title: '',
      content: '',
      videoUrl: '',
      videoFile: null,
      videoThumbnail: null
    }]
  }])

  const addChapter = () => {
    setChapters([...chapters, {
      title: '',
      topics: [{
        title: '',
        content: '',
        videoUrl: '',
        videoFile: null,
        videoThumbnail: null
      }]
    }])
  }

  const addTopic = (chapterIndex: number) => {
    const newChapters = [...chapters]
    newChapters[chapterIndex].topics.push({
      title: '',
      content: '',
      videoUrl: '',
      videoFile: null,
      videoThumbnail: null
    })
    setChapters(newChapters)
  }

  const removeChapter = (chapterIndex: number) => {
    const newChapters = chapters.filter((_, index) => index !== chapterIndex)
    setChapters(newChapters)
  }

  const removeTopic = (chapterIndex: number, topicIndex: number) => {
    const newChapters = [...chapters]
    newChapters[chapterIndex].topics = newChapters[chapterIndex].topics.filter((_, index) => index !== topicIndex)
    setChapters(newChapters)
  }

  const handleCourseThumbnailUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCourseData(prev => ({ ...prev, thumbnail: file }))
    }
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault() // Prevents default form submission

    const formData = new FormData()

    // Append course details
    formData.append('title', courseData.title)
    formData.append('description', courseData.description)
    formData.append('price', courseData.price.toString())
    formData.append('category', courseData.category)
    formData.append('level', courseData.level)
    formData.append('tags', courseData.tags)

    // Append the thumbnail
    if (courseData.thumbnail) {
      formData.append('thumbnail', courseData.thumbnail)
    }

    // Append chapters and topics
    chapters.forEach((chapter, chapterIndex) => {
      formData.append(`chapters[${chapterIndex}].title`, chapter.title)
      chapter.topics.forEach((topic, topicIndex) => {
        formData.append(`chapters[${chapterIndex}].topics[${topicIndex}].title`, topic.title)
        formData.append(`chapters[${chapterIndex}].topics[${topicIndex}].content`, topic.content)
        formData.append(`chapters[${chapterIndex}].topics[${topicIndex}].videoUrl`, topic.videoUrl)
        if (topic.videoFile) {
          formData.append(`chapters[${chapterIndex}].topics[${topicIndex}].videoFile`, topic.videoFile)
        }
        if (topic.videoThumbnail) {
          formData.append(`chapters[${chapterIndex}].topics[${topicIndex}].videoThumbnail`, topic.videoThumbnail)
        }
      })
    })

    try {
      await axios.post('/api/courses/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      alert('Course created successfully!')
      // Optionally, redirect or reset form
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create a New Course</h1>
        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Course Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input 
                placeholder="Course Title" 
                value={courseData.title}
                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))} 
              />
              <Textarea 
                placeholder="Course Description" 
                value={courseData.description}
                onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))} 
              />
              <Input 
                type="number" 
                placeholder="Price" 
                value={courseData.price}
                onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) }))} 
              />
              <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webdev">Web Development</SelectItem>
                  <SelectItem value="mobiledev">Mobile Development</SelectItem>
                  <SelectItem value="datascience">Data Science</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courseData.level} onValueChange={(value) => setCourseData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="Tags (comma-separated)" 
                value={courseData.tags}
                onChange={(e) => setCourseData(prev => ({ ...prev, tags: e.target.value }))} 
              />
            </div>

            {/* Course Thumbnail */}
            <div>
              <label htmlFor="courseThumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <Input 
                id="courseThumbnail" 
                type="file" 
                accept="image/*" 
                onChange={handleCourseThumbnailUpload}
                className="mb-4"
              />
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {courseData.thumbnail ? (
                  <Image src={URL.createObjectURL(courseData.thumbnail)} alt="Course Thumbnail" layout="fill" objectFit="cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-muted-foreground">Course Thumbnail Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chapters and Topics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Chapters</h2>
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="space-y-4">
                <Input 
                  placeholder={`Chapter ${chapterIndex + 1} Title`} 
                  value={chapter.title}
                  onChange={(e) => {
                    const newChapters = [...chapters]
                    newChapters[chapterIndex].title = e.target.value
                    setChapters(newChapters)
                  }} 
                />
                {chapter.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="space-y-4">
                    <Input 
                      placeholder={`Topic ${topicIndex + 1} Title`} 
                      value={topic.title}
                      onChange={(e) => {
                        const newChapters = [...chapters]
                        newChapters[chapterIndex].topics[topicIndex].title = e.target.value
                        setChapters(newChapters)
                      }} 
                    />
                    <Textarea 
                      placeholder="Content"
                      value={topic.content}
                      onChange={(e) => {
                        const newChapters = [...chapters]
                        newChapters[chapterIndex].topics[topicIndex].content = e.target.value
                        setChapters(newChapters)
                      }} 
                    />
                    <Input 
                      placeholder="Video URL"
                      value={topic.videoUrl}
                      onChange={(e) => {
                        const newChapters = [...chapters]
                        newChapters[chapterIndex].topics[topicIndex].videoUrl = e.target.value
                        setChapters(newChapters)
                      }} 
                    />
                    {/* Add file upload for video file and thumbnail */}
                    <Input 
                      type="file" 
                      accept="video/*"
                      onChange={(e) => {
                        const newChapters = [...chapters]
                        newChapters[chapterIndex].topics[topicIndex].videoFile = e.target.files?.[0] ?? null
                        setChapters(newChapters)
                      }} 
                    />
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const newChapters = [...chapters]
                        newChapters[chapterIndex].topics[topicIndex].videoThumbnail = e.target.files?.[0]?.name ?? null
                        setChapters(newChapters)
                      }} 
                    />
                    <Button type="button" variant="destructive" onClick={() => removeTopic(chapterIndex, topicIndex)}><Trash2 /> Remove Topic</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addTopic(chapterIndex)}>Add Topic</Button>
                <Button type="button" variant="destructive" onClick={() => removeChapter(chapterIndex)}><Trash2 /> Remove Chapter</Button>
              </div>
            ))}
            <Button type="button" onClick={addChapter}>Add Chapter</Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">Create Course</Button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
