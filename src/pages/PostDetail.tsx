/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Skeleton } from '../components/ui/skeleton'
import { Button } from '../components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { CalendarDays, User, ArrowLeft } from 'lucide-react'

interface SkillPost {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  created_at: string
  user_id: string
  profiles: {
    name: string
    avatar_url: string
  }
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<SkillPost | any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('skill_posts')
        .select(`
          id,
          title,
          description,
          category,
          image_url,
          created_at,
          user_id,
          profiles (
            name,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      setPost(data)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError('Failed to load post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl mb-8" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center mt-8">
          <Skeleton className="h-12 w-12 rounded-full mr-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => id && fetchPost(id)}>Retry</Button>
        </Card>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <Card className="p-8">
          <p className="text-gray-500 mb-4">Post not found</p>
          <Button asChild variant="outline">
            <Link to="/explore">Browse other posts</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8 ">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/explore" className="flex items-center hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all posts
        </Link>
      </Button>

      <article className="space-y-8">
        <header className="space-y-2">
          <Badge variant="secondary" className="text-sm font-medium">
            {post.category}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="rounded-xl w-full h-auto max-h-[20rem] object-cover shadow-lg"
          />
        ) : (
          <div className="w-full h-64 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-6xl text-gray-400">
            📷
          </div>
        )}

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg leading-7">{post.description}</p>
        </div>

        <footer className="border-t pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.profiles.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Posted by {post.profiles.name}</p>
              <Button variant="ghost" size="sm" className="mt-1" asChild>
                <Link to={`/profile/${post.user_id}`}>View profile</Link>
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}