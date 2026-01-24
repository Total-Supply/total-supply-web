import { BlogPage } from '@/src/components/blog/blog-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Total Supply',
  description: 'Read the latest news, updates, and insights from Total Supply.',
}

export default function Blog() {
  return <BlogPage />
}
