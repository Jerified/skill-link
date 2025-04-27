import { CreatePostForm } from '../components/posts/CreatePostForm'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/explore')
  }

  return (
    <div className="py-8">
      <CreatePostForm onSuccess={handleSuccess} />
    </div>
  )
}