import { motion, stagger, useAnimate, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scope, animate] = useAnimate()
  const { user, signOut } = useAuth()
  const location = useLocation()

  // Define nav links based on authentication status
  const navLinks = user ? [
    { title: "Home", to: "/" },
    { title: "Explore", to: "/explore" },
    { title: "Create Post", to: "/create-post" },
    { title: "Profile", to: "/profile" }, // Changed to just /profile for current user
  ] : [
    { title: "Home", to: "/" },
    { title: "Explore", to: "/explore" },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      animate("li", 
        { opacity: 1, x: 0 },
        { delay: stagger(0.1, { startDelay: 0.15 }), 
          duration: 0.4,
          ease: [0.25, 1, 0.5, 1] 
        }
      )
    }
  }

  // Determine if a nav link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay: 0.1
      }}
      className='fixed top-0 left-0 right-0 z-50 shadow-sm rounded-[100px] py-2 md:py-4 mt-5 px-4 md:px-8 bg-white mx-2 md:mx-4'
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">SL</span>
            </div>
          </motion.div>
          <span className="font-bold text-lg hidden sm:block">SkillLink</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isActiveLink(link.to) 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.title}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop User Section */}
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-sm font-medium"
              >
                Sign Out
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-full"
          aria-label="Menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleMenu}
            />
            
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white z-50 shadow-xl md:hidden overflow-y-auto"
            >
              <div className="h-full flex flex-col">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">SL</span>
                    </div>
                    <span className="text-lg font-bold">SkillLink</span>
                  </div>
                  <button 
                    onClick={toggleMenu} 
                    className="p-2"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Drawer Navigation Links */}
                <div className="flex-1 p-4">
                  <motion.ul 
                    ref={scope}
                    className="space-y-2"
                  >
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                      >
                        <Link
                          to={link.to}
                          onClick={toggleMenu}
                          className={`w-full px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 text-lg font-medium ${
                            isActiveLink(link.to) 
                              ? 'text-indigo-600 bg-indigo-50' 
                              : 'text-gray-800'
                          }`}
                        >
                          {link.title}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* User Section */}
                <div className="p-4 border-t">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <Link to="/profile" onClick={toggleMenu}>
                        <Avatar>
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <p className="font-medium">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Link to="/profile/edit" onClick={toggleMenu} className="text-sm text-indigo-600">
                            Edit Profile
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              signOut()
                              toggleMenu()
                            }}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" onClick={toggleMenu}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register" onClick={toggleMenu}>
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
