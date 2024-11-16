import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import Link from "next/link"

interface CourseCardProps {
  id: string
  title: string
  thumbnail: string
  tags: string[]
  completion?: number
  rating?: number
  instructor: {
    name: string
    avatar: string
  }
}

export function CourseCard({
  id,
  title,
  thumbnail,
  tags,
  completion,
  rating,
  instructor
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative bg-muted">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full"
          />
          {completion !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/90">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>COMPLETED</span>
                <span>{completion}%</span>
              </div>
              <Progress value={completion} className="h-1" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <img src={instructor.avatar} alt={instructor.name} />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{instructor.name}</p>
              {rating !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-muted px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}