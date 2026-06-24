"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  value: { label: "Rating", color: "#8B5CF6" },
} satisfies ChartConfig

export function OverallRating({
  averageRating = 0,
  totalReviews = 0,
  comments = [],
}: {
  averageRating?: number
  totalReviews?: number
  comments?: any[]
}) {
  const chartData = [{ name: "Rating", value: averageRating }]

  // Calculate breakdown averages based on overall ratings
  const breakdown = {
    cleanliness: 0,
    communication: 0,
    location: 0,
    value: 0
  }

  let countWithBreakdown = 0
  comments.forEach((review: any) => {
    const r = review.rating || 0
    breakdown.cleanliness += r
    breakdown.communication += r
    breakdown.location += r
    breakdown.value += r
    countWithBreakdown++
  })

  const averages = {
    cleanliness: countWithBreakdown ? Number((breakdown.cleanliness / countWithBreakdown).toFixed(1)) : 0,
    communication: countWithBreakdown ? Number((breakdown.communication / countWithBreakdown).toFixed(1)) : 0,
    location: countWithBreakdown ? Number((breakdown.location / countWithBreakdown).toFixed(1)) : 0,
    value: countWithBreakdown ? Number((breakdown.value / countWithBreakdown).toFixed(1)) : 0,
  }

  // Determine an adjective matching the rating
  let ratingAdjective = "Excellent"
  if (averageRating >= 4.5) ratingAdjective = "Impressive"
  else if (averageRating >= 4.0) ratingAdjective = "Very Good"
  else if (averageRating >= 3.0) ratingAdjective = "Good"
  else if (averageRating >= 2.0) ratingAdjective = "Fair"
  else if (averageRating > 0) ratingAdjective = "Poor"
  else ratingAdjective = "No Reviews"

  return (
    <Card className="max-w-full rounded-2xl shadow-sm border bg-card text-card-foreground overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold tracking-tight">Overall Rating</CardTitle>
        {/* <Button variant="secondary" size="sm" className="h-8 bg-violet-600 hover:bg-violet-700 text-white rounded-lg gap-1 px-3">
          This Week <ChevronDown className="h-3 w-3" />
        </Button> */}
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-start pt-2">
        {/* Left Side: Radial Gauge & Summary Block */}
        <div className="flex flex-col items-center gap-3">
          <ChartContainer config={chartConfig} className="aspect-square w-full max-w-[150px]">
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius={55}   /* Smaller radius to fit side-by-side */
              outerRadius={85}
              barSize={15}
            >
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={5}
                fill="#8B5CF6"
                className="stroke-transparent stroke-2"
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-foreground text-xl font-bold"
                          >
                            {averageRating.toFixed(1)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 10}
                            className="fill-muted-foreground text-[10px]"
                          >
                            Out of 5
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>

          {/* Purple Summary Block matching image */}
          <div className="w-full bg-violet-600 text-white p-3 rounded-xl text-center shadow-md">
            <p className="text-lg font-bold">{ratingAdjective}</p>
            <p className="text-[10px] opacity-80 font-medium tracking-wide">from {totalReviews} reviews</p>
          </div>
        </div>

        {/* Right Side: Linear Progress Bars */}
        <div className="space-y-4 pt-4">
          <RatingRow label="Cleanliness" score={averages.cleanliness} value={averages.cleanliness * 20} />
          <RatingRow label="Communication" score={averages.communication} value={averages.communication * 20} />
          <RatingRow label="Location" score={averages.location} value={averages.location * 20} />
          <RatingRow label="Value" score={averages.value} value={averages.value * 20} />
        </div>
      </CardContent>
    </Card>
  )
}

function RatingRow({ label, score, value }: { label: string; score: number; value: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[11px] font-semibold mb-1.5">
        <span className="text-muted-foreground tracking-tight">{label}</span>
        <span className="text-foreground">{score.toFixed(1)}</span>
      </div>
      {/* Light sage green progress bars matching the image style */}
      <Progress value={value} className="h-1.5 bg-zinc-200 [&>div]:bg-[#C2D9C8]" />
    </div>
  )
}