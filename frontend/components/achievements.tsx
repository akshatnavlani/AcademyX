import { Badge } from "@/components/ui/badge"

interface AchievementsProps {
  achievements: string[]
  level: string
}

export function Achievements({ achievements, level,  }: AchievementsProps) {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Your Achievements</h3>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{level}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement, index) => (
          <Badge key={index} variant="outline">{achievement}</Badge>
        ))}
      </div>
    </div>
  )
}