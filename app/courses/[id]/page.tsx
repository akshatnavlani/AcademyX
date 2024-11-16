"use client"

import { useState } from 'react'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Play, ChevronDown, Star, ImageIcon, Lock } from 'lucide-react'
import Image from 'next/image'

// Mock course data (replace with actual data fetching)
const courseData = {
  id: '1',
  title: 'COURSE TITLE',
  description: 'COURSE DESCRIPTION: LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISICING ELIT. ID, QUIS EIUS NON DOLORE QUAE TEMPORA VEL SED SUNT DEBITIS, VOLUPTATEM ET RATIONE REM ADIPISCI PERSPICIATIS BLANDITIIS CONSECTETUR EA',
  thumbnail: '/placeholder.svg?height=400&width=800',
  rating: 4.5,
  tags: ['TAG X', 'TAG Y', 'TAG Z', 'TAG A', 'TAG B'],
  chapters: [
    {
      title: 'Chapter 1',
      topics: [
        {
          title: 'Introduction',
          description: 'Topic description',
          videoUrl: 'https://example.com/video1.mp4',
          videoThumbnail: '/placeholder.svg?height=200&width=400'
        },
        {
          title: 'Getting Started',
          description: 'Topic description',
          videoUrl: 'https://example.com/video2.mp4',
          videoThumbnail: null
        },
      ],
    },
    {
      title: 'Chapter 2',
      topics: [
        {
          title: 'Advanced Concepts',
          description: 'Topic description',
          videoUrl: 'https://example.com/video3.mp4',
          videoThumbnail: '/placeholder.svg?height=200&width=400'
        },
      ],
    },
  ],
  isBought: false, // This would be determined by your authentication and purchase system
}

export default function CourseView() {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)

  const playVideo = (videoUrl: string) => {
    if (courseData.isBought || videoUrl === courseData.chapters[0].topics[0].videoUrl) {
      setCurrentVideo(videoUrl)
    } else {
      alert("Please purchase the course to access this video.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="w-full aspect-[2/1] bg-muted relative group cursor-pointer" onClick={() => playVideo(courseData.chapters[0].topics[0].videoUrl)}>
          <Image
            src={courseData.thumbnail}
            alt={courseData.title}
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div>
                <h1 className="text-2xl font-bold mb-2">{courseData.title}</h1>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(courseData.rating)
                          ? "fill-primary text-primary"
                          : i < courseData.rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{courseData.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            {!courseData.isBought && (
              <Button size="lg">Buy Course</Button>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">COURSE DESCRIPTION:</h2>
            <p className="text-sm">{courseData.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-2">COURSE TAGS:</h2>
            <div className="flex flex-wrap gap-2">
              {courseData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {courseData.chapters.map((chapter, chapterIndex) => (
              <AccordionItem
                value={`chapter-${chapterIndex}`}
                key={chapterIndex}
                className="border rounded-lg mb-2 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-medium">{chapter.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {chapter.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="mb-4 last:mb-0"
                    >
                      <div className="flex gap-4">
                        <div 
                          className="relative w-48 aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer"
                          onClick={() => playVideo(topic.videoUrl)}
                        >
                          {topic.videoThumbnail ? (
                            <Image
                              src={topic.videoThumbnail}
                              alt={topic.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : courseData.thumbnail ? (
                            <Image
                              src={courseData.thumbnail}
                              alt="Course Thumbnail"
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            {courseData.isBought || (chapterIndex === 0 && topicIndex === 0) ? (
                              <Play className="w-12 h-12 text-white" />
                            ) : (
                              <Lock className="w-12 h-12 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {currentVideo && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="fixed inset-[50%] w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={currentVideo}
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <Button
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => setCurrentVideo(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}