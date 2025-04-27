import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import AvatarUpload from '../AvatarUpload';

interface ProfileFormProps {
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
}

interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  mode = 'edit', 
  onSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<Omit<Profile, 'id'>>({
    name: '',
    avatar_url: null,
    bio: null,
    location: null
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found is ok for create mode
          throw error;
        }
      }
      
      if (data) {
        setProfile(data);
        // If we found a profile, we're in edit mode
        if (mode === 'create') mode = 'edit';
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, mode]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarChange = useCallback((file: File) => {
    setAvatarFile(file);
  }, []);

  const uploadAvatar = useCallback(async (): Promise<string | null> => {
    if (!avatarFile || !user?.id) return profile.avatar_url;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error(error);
      return null;
    }
  }, [avatarFile, profile.avatar_url, user?.id]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      setSubmitting(true);
      
      const avatarUrl = await uploadAvatar();
      const profileData = {
        ...profile,
        id: user.id,
        avatar_url: avatarUrl || profile.avatar_url,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);
        
      if (error) throw error;
      
      toast.success(`Profile ${mode === 'create' ? 'created' : 'updated'} successfully`);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(`Failed to ${mode === 'create' ? 'create' : 'update'} profile`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }, [mode, onSuccess, profile, uploadAvatar, user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <AvatarUpload 
          initialUrl={profile.avatar_url} 
          onFileChange={handleAvatarChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={profile.name || ''}
          onChange={handleChange}
          required
          minLength={2}
          placeholder="Enter your full name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={profile.location || ''}
          onChange={handleChange}
          placeholder="City, Country"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          value={profile.bio || ''}
          onChange={handleChange}
          maxLength={500}
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-muted-foreground text-right">
          {(profile.bio?.length || 0)}/500
        </p>
      </div>
      
      <div className="flex gap-4 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={submitting} 
          className="flex-1"
        >
          {submitting 
            ? `${mode === 'create' ? 'Creating' : 'Saving'}...` 
            : `${mode === 'create' ? 'Create' : 'Save'} Profile`}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(ProfileForm);
