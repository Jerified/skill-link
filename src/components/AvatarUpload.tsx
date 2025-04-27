// components/AvatarUpload.tsx
import React, { useState, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AvatarUploadProps {
  initialUrl?: string | null;
  onFileChange: (file: File) => void;
}

const AvatarUpload = React.memo(({ initialUrl, onFileChange }: AvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    }
  }, [onFileChange]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Avatar className="h-24 w-24">
        {previewUrl ? (
          <AvatarImage src={previewUrl} alt="Profile avatar" />
        ) : (
          <AvatarFallback>U</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col gap-2">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          className="hidden"
          id="avatar-upload"
        />
        <Button
          variant="outline"
          type="button"
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          Change Avatar
        </Button>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG or GIF. Max 5MB.
        </p>
      </div>
    </div>
  );
});

AvatarUpload.displayName = 'AvatarUpload';

export default AvatarUpload;