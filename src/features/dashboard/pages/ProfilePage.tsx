import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { userProfileSchema, type UserProfileInput } from '@/domain/auth/auth.schema';
import { userService } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { Loader2, Camera, User as UserIcon } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileUrl?.replace(/\]$/, '') || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.profileUrl) {
      setPreviewUrl(user.profileUrl.replace(/\]$/, ''));
    }
  }, [user?.profileUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: UserProfileInput) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      const response = await userService.updateProfile(user.uuid, data, file);
      
      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response) {
             toast.error(error.response.data?.message || 'Failed to update profile');
        } else if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error('Failed to update profile');
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Click to upload new picture
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
