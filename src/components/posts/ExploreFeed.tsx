/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'


export function ExploreFeed() {
  const [posts, setPosts] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
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
        .order('created_at', { ascending: false })
        .limit(9)

      if (supabaseError) {
        throw supabaseError
      }

      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-2xl p-5 w-80">
              <Skeleton className="h-48 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchPosts}>Retry</Button>
      </div>
    )
  }

  return (
    <section className="py-">
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer border border-gray-300 rounded-2xl p-5  transition-all duration-300 hover:border-gray-400"
            >
              <Link to={`/post/${post.id}`} className="block">
                <div className="flex items-center mb-6">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center text-4xl text-gray-400">
                      📷
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="]font-medium leading-8 mb-6 truncate">{post.title}</h4>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <h6 className=" truncate">By {post.profiles.name}</h6>
                    <span className="text-indigo-600">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Button asChild variant="outline" className="rounded-full px-8 py-3 font-semibold hover:bg-gray-100">
            <Link to="/explore">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
