// src/pages/Explore.tsx
import { ExploreFeed } from '../components/posts/ExploreFeed'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

export default function Explore() {
  return (
    <div className=" py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Skills</h1>
        <Button asChild>
          <Link to="/create-post">Share Your Skill</Link>
        </Button>
      </div>
      <ExploreFeed />
    </div>
  )
}