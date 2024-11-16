"use client"

import { useState, ChangeEvent } from 'react'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Upload, ImageIcon } from 'lucide-react'
import Image from 'next/image'

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
  const [chapters, setChapters] = useState<ChapterType[]>([
    {
      title: '',
      topics: [{
        title: '',
        content: '',
        videoUrl: '',
        videoFile: null,
        videoThumbnail: null
      }]
    }
  ])
  const [courseThumbnail, setCourseThumbnail] = useState<string | null>(null)

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
      const imageUrl = URL.createObjectURL(file)
      setCourseThumbnail(imageUrl)
    }
  }

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>, chapterIndex: number, topicIndex: number) => {
    const file = event.target.files?.[0]
    if (file) {
      const videoUrl = URL.createObjectURL(file)
      const newChapters = [...chapters]
      newChapters[chapterIndex].topics[topicIndex].videoFile = file
      newChapters[chapterIndex].topics[topicIndex].videoUrl = videoUrl
      setChapters([...newChapters])
    }
  }

  const handleVideoThumbnailUpload = (event: ChangeEvent<HTMLInputElement>, chapterIndex: number, topicIndex: number) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      const newChapters = [...chapters]
      newChapters[chapterIndex].topics[topicIndex].videoThumbnail = imageUrl
      setChapters([...newChapters])
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create a New Course</h1>
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input placeholder="Course Title" />
              <Textarea placeholder="Course Description" />
              <Input type="number" placeholder="Price" />
              <Select>
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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Tags (comma-separated)" />
            </div>
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
                {courseThumbnail ? (
                  <Image
                    src={courseThumbnail}
                    alt="Course Thumbnail"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-muted-foreground">Course Thumbnail Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Course Content</h2>
            {chapters.map((chapter, chapterIndex) => (
              <Card key={chapterIndex}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Input 
                      placeholder={`Chapter ${chapterIndex + 1} Title`}
                      value={chapter.title}
                      onChange={(e) => {
                        const newChapters = [...chapters]
                        newChapters[chapterIndex].title = e.target.value
                        setChapters(newChapters)
                      }}
                    />
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeChapter(chapterIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {chapter.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Topic Title"
                          value={topic.title}
                          onChange={(e) => {
                            const newChapters = [...chapters]
                            newChapters[chapterIndex].topics[topicIndex].title = e.target.value
                            setChapters(newChapters)
                          }}
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeTopic(chapterIndex, topicIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Topic Content"
                        value={topic.content}
                        onChange={(e) => {
                          const newChapters = [...chapters]
                          newChapters[chapterIndex].topics[topicIndex].content = e.target.value
                          setChapters(newChapters)
                        }}
                      />
                      <div className="grid gap-4">
                        <Input
                          placeholder="Video URL"
                          value={topic.videoUrl}
                          onChange={(e) => {
                            const newChapters = [...chapters]
                            newChapters[chapterIndex].topics[topicIndex].videoUrl = e.target.value
                            newChapters[chapterIndex].topics[topicIndex].videoFile = null
                            setChapters(newChapters)
                          }}
                        />
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoUpload(e, chapterIndex, topicIndex)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleVideoThumbnailUpload(e, chapterIndex, topicIndex)}
                            />
                          </div>
                        </div>
                        {(topic.videoThumbnail || topic.videoFile || topic.videoUrl) && (
                          <div className="relative w-48 aspect-video rounded-lg overflow-hidden">
                            {topic.videoThumbnail ? (
                              <Image
                                src={topic.videoThumbnail}
                                alt="Video Thumbnail"
                                layout="fill"
                                objectFit="cover"
                              />
                            ) : courseThumbnail ? (
                              <Image
                                src={courseThumbnail}
                                alt="Course Thumbnail"
                                layout="fill"
                                objectFit="cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-muted">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addTopic(chapterIndex)}>Add Topic</Button>
                </CardContent>
              </Card>
            ))}
            <Button type="button" onClick={addChapter}>Add Chapter</Button>
          </div>

          <Button type="submit">Create Course</Button>
        </form>
      </main>
      <Footer />
    </div>
  )
}