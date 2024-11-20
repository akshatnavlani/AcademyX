'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Upload, BookOpen, Video, Camera } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { auth } from "@/app/firebase/config"
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const place = process.env.IMAGES_PATH
const NEXT_URI = "http://localhost:5000/api/courses";

interface TopicType {
  title: string
  description: string
  videoUrl: string
  videoThumbnail: string | null
}

interface ChapterType {
  title: string
  topics: TopicType[]
}

export default function CreateCourse() {
  const { toast } = useToast()
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    get_points: 0,
    instructor: {
      name: '',
      avatar: '',
    },
    thumbnail: null as File | null,
    thumbnailPath: '' as string | null,
    tags: [] as string[],
    number_of_videos: 0,
  })
  const [chapters, setChapters] = useState<ChapterType[]>([{
    title: '',
    topics: [{
      title: '',
      description: '',
      videoUrl: '',
      videoThumbnail: null
    }]
  }])

  const addChapter = () => {
    setChapters([...chapters, {
      title: '',
      topics: [{
        title: '',
        description: '',
        videoUrl: '',
        videoThumbnail: null
      }]
    }])
  }

  const addTopic = (chapterIndex: number) => {
    const newChapters = [...chapters]
    newChapters[chapterIndex].topics.push({
      title: '',
      description: '',
      videoUrl: '',
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

  const handleCourseThumbnailUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCourseData(prev => ({ ...prev, thumbnail: file }))
      const path = `${place}/${file.name}`
      setCourseData(prev => ({ ...prev, thumbnailPath: path }))
    }
  }

  const handleVideoThumbnailUpload = async (chapterIndex: number, topicIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const path = `${place}/${file.name}`
      const newChapters = [...chapters]
      newChapters[chapterIndex].topics[topicIndex].videoThumbnail = path
      setChapters(newChapters)
    }
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const userEmail = auth.currentUser?.email || '';
    
    const formData = new FormData()

    formData.append('title', courseData.title)
    formData.append('description', courseData.description)
    formData.append('get_points', courseData.get_points.toString())
    formData.append('tags', JSON.stringify(courseData.tags))
    formData.append('number_of_videos', courseData.number_of_videos.toString())
    formData.append('email', userEmail)
    formData.append('thumbnail', courseData.thumbnailPath || '')

    chapters.forEach((chapter, chapterIndex) => {
      formData.append(`chapters[${chapterIndex}][title]`, chapter.title)
      chapter.topics.forEach((topic, topicIndex) => {
        formData.append(`chapters[${chapterIndex}][topics][${topicIndex}][title]`, topic.title)
        formData.append(`chapters[${chapterIndex}][topics][${topicIndex}][description]`, topic.description)
        formData.append(`chapters[${chapterIndex}][topics][${topicIndex}][videoUrl]`, topic.videoUrl)
        formData.append(`chapters[${chapterIndex}][topics][${topicIndex}][videoThumbnail]`, topic.videoThumbnail || '')
      })
    })

    try {
      const response = await axios.post(`${NEXT_URI}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Course created successfully!",
        })
      } else {
        throw new Error('Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="bg-gray-100 dark:bg-gray-700 p-6 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">Create an Engaging Course</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Course Title</Label>
                    <Input 
                      id="courseTitle"
                      placeholder="Enter an inspiring title"
                      value={courseData.title}
                      onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))} 
                      required
                      className="border-2 border-gray-200 focus:border-gray-500 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseDescription" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Course Description</Label>
                    <Textarea 
                      id="courseDescription"
                      placeholder="Describe your course in detail" 
                      value={courseData.description}
                      onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))} 
                      required
                      className="border-2 border-gray-200 focus:border-gray-500 rounded-md h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coursePoints" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Points to Earn</Label>
                    <Input 
                      id="coursePoints"
                      type="number" 
                      placeholder="Enter points to earn" 
                      value={courseData.get_points}
                      onChange={(e) => setCourseData(prev => ({ ...prev, get_points: parseInt(e.target.value) }))} 
                      required
                      className="border-2 border-gray-200 focus:border-gray-500 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseTags" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tags</Label>
                    <Input 
                      id="courseTags"
                      placeholder="Enter tags (comma-separated)" 
                      value={courseData.tags.join(', ')}
                      onChange={(e) => setCourseData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))} 
                      className="border-2 border-gray-200 focus:border-gray-500 rounded-md"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {courseData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseThumbnail" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Course Thumbnail</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="courseThumbnail" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 overflow-hidden relative">
                        {courseData.thumbnail ? (
                          <>
                            <Image 
                              src={URL.createObjectURL(courseData.thumbnail)} 
                              alt="Course Thumbnail" 
                              layout="fill" 
                              objectFit="cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <Camera className="w-12 h-12 text-white" />
                              <span className="sr-only">Change thumbnail</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                        )}
                        <Input 
                          id="courseThumbnail" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCourseThumbnailUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {chapters.map((chapter, chapterIndex) => (
                  <AccordionItem value={`chapter-${chapterIndex}`} key={chapterIndex} className="border border-gray-200 rounded-lg mb-4">
                    <AccordionTrigger className="text-left hover:bg-gray-50 rounded-t-lg px-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-gray-500" />
                          <Input 
                            placeholder={`Chapter ${chapterIndex + 1} Title`}
                            value={chapter.title}
                            onChange={(e) => {
                              const newChapters = [...chapters]
                              newChapters[chapterIndex].title = e.target.value
                              setChapters(newChapters)
                            }} 
                            required
                            className="border-none bg-transparent focus:ring-0 text-lg font-semibold"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={(e) => {
                            e.stopPropagation()
                            removeChapter(chapterIndex)
                          }} 
                          size="icon" 
                          aria-label="Remove Chapter"
                          className="hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white dark:bg-gray-800 p-4 rounded-b-lg">
                      {chapter.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Video className="h-5 w-5 text-gray-500" />
                            <Input 
                              placeholder={`Topic ${topicIndex + 1} Title`}
                              value={topic.title}
                              onChange={(e) => {
                                const newChapters = [...chapters]
                                newChapters[chapterIndex].topics[topicIndex].title = e.target.value
                                setChapters(newChapters)
                              }} 
                              required
                              className="border-gray-200 focus:border-gray-500"
                            />
                          </div>
                          <Textarea 
                            placeholder={`Topic ${topicIndex + 1} Description`}
                            value={topic.description}
                            onChange={(e) => {
                              const newChapters = [...chapters]
                              newChapters[chapterIndex].topics[topicIndex].description = e.target.value
                              setChapters(newChapters)
                            }} 
                            required
                            className="border-gray-200 focus:border-gray-500"
                          />
                          <Input 
                            placeholder={`Topic ${topicIndex + 1} Video URL`}
                            value={topic.videoUrl}
                            onChange={(e) => {
                              const newChapters = [...chapters]
                              newChapters[chapterIndex].topics[topicIndex].videoUrl = e.target.value
                              setChapters(newChapters)
                            }} 
                            required
                            className="border-gray-200 focus:border-gray-500"
                          />
                          <div className="flex items-center space-x-4">
                            <Input 
                              type="file" 
                              onChange={(e) => handleVideoThumbnailUpload(chapterIndex, topicIndex, e)}
                              className="flex-grow border-gray-200 focus:border-gray-500"
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              onClick={() => removeTopic(chapterIndex, topicIndex)} 
                              size="icon" 
                              aria-label="Remove Topic"
                              className="hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        onClick={() => addTopic(chapterIndex)} 
                        className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Topic
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Button 
                type="button" 
                onClick={addChapter} 
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Chapter
              </Button>

              <Button 
                type="submit" 
                className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200" 
                disabled={!courseData.title || !courseData.description}
              >
                Create Course
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}