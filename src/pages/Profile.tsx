import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabaseClient';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const isCurrentUser = !userId || userId === user?.id;
  const profileId = userId || user?.id;

  useEffect(() => {
    if (!profileId) {
      if (!user) {
        toast.error('Please log in to view profiles');
        navigate('/login');
      }
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found
            if (isCurrentUser) {
              navigate('/profile/edit');
              return;
            } else {
              toast.error('Profile not found');
            }
          } else {
            throw error;
          }
        }

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, user, navigate, isCurrentUser]);

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div className="container py-8 text-center">
        <Card className="p-6">
          <h1 className="text-xl font-semibold mb-4">Profile Not Found</h1>
          {isCurrentUser && (
            <div className="mt-4">
              <p className="mb-4">You haven't set up your profile yet.</p>
              <Button onClick={() => navigate('/profile/edit')}>
                Create Your Profile
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isCurrentUser ? 'Your Profile' : `${profile?.name}'s Profile`}
          </h1>
          {isCurrentUser && (
            <Button onClick={() => navigate('/profile/edit')}>
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
              ) : (
                <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              {profile?.location && (
                <p className="text-muted-foreground">{profile.location}</p>
              )}
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Bio</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
