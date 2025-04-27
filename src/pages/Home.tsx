// src/pages/Home.tsx
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="">
      <div className=" flex flex-col items-center justify-center px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=""
        >
          <h1 className="text-5xl md:!text-[3rem] font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-600">
            Showcase Your Unique Skills
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join a vibrant community where talent meets opportunity. Whether you're looking to share your expertise or discover amazing abilities, we connect passionate individuals worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="px-8 py-6 text-lg shadow-lg">
                    <Link to="/explore">Explore Skills</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" asChild size="lg" className="px-8 py-6 text-lg border-2">
                    <Link to="/create-post">Share Your Skill</Link>
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="px-8 py-6 text-lg shadow-lg">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" asChild size="lg" className="px-8 py-6 text-lg border-2 hover:!text-white">
                    <Link to="/login">Login</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}