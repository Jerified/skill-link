import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ProfileForm from '../components/profile/ProfileForm';
import { Card } from '../components/ui/card';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to edit your profile');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="container py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        <ProfileForm 
          mode="edit"
          onSuccess={() => {
            toast.success('Profile updated successfully');
            navigate('/profile');
          }}
        />
      </Card>
    </div>
  );
};

export default EditProfile;
