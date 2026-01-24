'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { BookOpen, Calendar, Clock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BlogPage() {
  const router = useRouter()

  const posts = [
    {
      title: '5 Tips for Fresh Food Storage',
      excerpt:
        'Learn how to keep your groceries fresh longer with these simple storage techniques.',
      author: 'Sarah Silva',
      date: 'January 20, 2026',
      readTime: '5 min read',
      category: 'Food & Storage',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop',
    },
    {
      title: 'The Benefits of Professional Cleaning Services',
      excerpt:
        'Discover why hiring professional cleaners can save you time and improve your quality of life.',
      author: 'Kasun Perera',
      date: 'January 18, 2026',
      readTime: '4 min read',
      category: 'Cleaning',
      image:
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop',
    },
    {
      title: 'IT Support Best Practices for Small Businesses',
      excerpt:
        'Essential IT support strategies every small business owner should know.',
      author: 'Amara Fernando',
      date: 'January 15, 2026',
      readTime: '6 min read',
      category: 'Technology',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16 sm:py-20 lg:py-24">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
              Our Blog
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground">
              Tips, insights, and updates from the Total Supply team
            </p>
          </MotionBox>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">
          {posts.map((post, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <article className="group rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                  {/* Image */}
                  <div className="relative aspect-video md:aspect-square overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge
                      variant="solid"
                      colorPalette="primary"
                      className="absolute top-4 left-4 text-xs"
                    >
                      {post.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </MotionBox>
          ))}
        </div>

        {/* Coming Soon Message */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              More articles coming soon!
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              We&#39;re working on more great content for you
            </p>
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
