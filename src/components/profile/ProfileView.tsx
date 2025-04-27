import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Pencil } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string;
}

// Default profile image (can be hosted or use a placeholder service)
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
const DEFAULT_LOCATION = 'Earth'; // Or get from browser geolocation
const DEFAULT_BIO = 'Tell us about yourself...';

export function ProfileView({ userId, isCurrentUser }: { userId: string; isCurrentUser: boolean }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if profile exists
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId);

        if (fetchError) throw fetchError;

        // If no profile found
        if (!data || data.length === 0) {
          if (isCurrentUser) {
            // For current user, create a profile with default values
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ 
                id: userId,
                name: 'New User',
                avatar_url: DEFAULT_AVATAR,
                location: DEFAULT_LOCATION,
                bio: DEFAULT_BIO,
                created_at: new Date().toISOString()
              }])
              .select()
              .single();

            if (createError) throw createError;
            setProfile(newProfile);
          } else {
            setProfile(null);
          }
        } else {
          // Profile exists - ensure defaults for null fields
          const completeProfile = {
            ...data[0],
            avatar_url: data[0].avatar_url || DEFAULT_AVATAR,
            location: data[0].location || DEFAULT_LOCATION,
            bio: data[0].bio || DEFAULT_BIO
          };
          setProfile(completeProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isCurrentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p>Profile not found</p>
        {isCurrentUser && (
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Create My Profile
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url || DEFAULT_AVATAR} />
              <AvatarFallback>
                {profile.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {isCurrentUser && (
              <Link
                to="/profile/edit"
                className="absolute bottom-0 right-0 bg-primary rounded-full p-2 hover:bg-primary/90 transition-colors"
                aria-label="Edit profile"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Link>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {isCurrentUser && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/profile/edit">Edit Profile</Link>
                </Button>
              )}
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{profile.location}</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mt-4">
              {profile.bio}
              {isCurrentUser && profile.bio === DEFAULT_BIO && (
                <span className="text-gray-500 italic"> (click edit to customize)</span>
              )}
            </p>
          </div>
        </div>

        {/* Additional sections */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">Member since</h3>
              <p>{new Date(profile.updated_at).toLocaleDateString()}</p>
            </div>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}