import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [, setLoading] = useState(true)

  useEffect(() => {
    // Check for error parameters in the URL
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      toast.error(errorDescription || 'Authentication error')
      navigate('/login', { replace: true })
      return
    }

    // Handle successful authentication
    const handleAuthChange = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (data.session) {
          navigate('/', { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      } catch (error) {
        console.error('Error during auth callback:', error)
        toast.error('Authentication failed')
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    handleAuthChange()
  }, [navigate, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Completing authentication...</p>
      </div>
    </div>
  )
}
