import { useState, useMemo } from 'react'
import { marked } from 'marked'

import { createFileRoute, Link } from '@tanstack/react-router'
import { allJobs, allEducations } from 'content-collections'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '#/components/ui/hover-card'

import ResumeAssistant from '#/components/ResumeAssistant'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get unique tags from all jobs
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allJobs.forEach((job) => {
      job.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Filter jobs based on selected tags
  const filteredJobs = useMemo(() => {
    if (selectedTags.length === 0) return allJobs
    return allJobs.filter((job) =>
      selectedTags.some((tag) => job.tags.includes(tag)),
    )
  }, [selectedTags])

  return (
    <>
      <ResumeAssistant />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptLTEyIDZjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0yNCAyNGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-bold tracking-tight">
                Welcome to My Professional Portfolio
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Explore my career journey, technical expertise, and professional accomplishments. 
                Discover how my experience can bring value to your organization.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Learn More About Me
                </Link>
                <Link
                  to="/food"
                  className="inline-flex items-center px-8 py-3 bg-white text-base font-medium rounded-lg text-blue-700 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Food Management
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
            </svg>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar with filters */}
          <div className="w-72 min-h-screen bg-white border-r shadow-sm p-8 sticky top-0">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">
              Skills & Technologies
            </h3>
            <div className="space-y-4">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag])
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                    }}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor={tag}
                    className="text-sm font-medium leading-none text-gray-700 group-hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  My Resume
                </h1>
                <p className="text-gray-600 text-lg">
                  Professional Experience & Education
                </p>
                <Separator className="mt-8" />
              </div>

              {/* Career Summary */}
              <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Career Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <p className="text-gray-700 flex-1 leading-relaxed">
                      I am a passionate and driven professional seeking
                      opportunities that will leverage my extensive experience
                      in frontend development while providing continuous growth
                      and learning opportunities. My goal is to contribute to
                      innovative projects that challenge me to expand my skill
                      set and make meaningful impacts through technology.
                    </p>
                    <img
                      src="/headshot-on-white.jpg"
                      alt="Professional headshot"
                      className="w-44 h-52 rounded-2xl object-cover shadow-md transition-transform hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.jobTitle}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="text-xl text-gray-900">
                              {job.jobTitle}
                            </CardTitle>
                            <p className="text-blue-600 font-medium">
                              {job.company} - {job.location}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-sm">
                            {job.startDate} - {job.endDate || 'Present'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {job.summary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <HoverCard key={tag}>
                              <HoverCardTrigger>
                                <Badge
                                  variant="outline"
                                  className="hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  {tag}
                                </Badge>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <p className="text-sm text-gray-600">
                                  Experience with {tag} in professional
                                  development
                                </p>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                        </div>
                        {job.content && (
                          <div
                            className="mt-6 text-gray-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: marked(job.content),
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Education
                </h2>
                <div className="space-y-6">
                  {allEducations.map((education) => (
                    <Card
                      key={education.school}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900">
                          {education.school}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {education.summary}
                        </p>
                        {education.content && (
                          <div
                            className="mt-6 text-gray-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: marked(education.content),
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
