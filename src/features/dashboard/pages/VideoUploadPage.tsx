import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { videoMetadataSchema, type VideoMetadataInput } from '@/domain/video/video.schema';
import { videoService } from '@/services/video.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, FileVideo, CheckCircle2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const VideoUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VideoMetadataInput>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      sourceType: 'OWN',
      isSafe: true,
      durationSeconds: 0,
      title: '',
      description: '',
      thumbnailUrl: ''
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        
        // Auto-detect duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const duration = Math.round(video.duration);
            setValue('durationSeconds', duration);
            toast.info(`Detected video duration: ${duration} seconds`);
        };
        video.src = URL.createObjectURL(selectedFile);
      } else {
        toast.error('Please select a valid video file');
      }
    }
  };

  const onSubmit = async (data: VideoMetadataInput) => {
    if (!file) {
      toast.error('Please select a video file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      await videoService.uploadVideo(data, file, (progress) => {
        setUploadProgress(progress);
      });
      setIsDone(true);
      toast.success('Video uploaded and processed successfully');
      reset();
      setFile(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  if (isDone) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Card className="text-center p-10">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Upload Complete!</h2>
              <p className="text-muted-foreground">
                Your video has been uploaded and is being processed. It will be available shortly.
              </p>
            </div>
            <Button onClick={() => setIsDone(false)} variant="outline">
              Upload Another Video
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Video</h1>
        <p className="text-muted-foreground">Create new content and share it with your audience.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter video title" {...register('title')} />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell viewers about your video" 
                  className="min-h-[120px]"
                  {...register('description')} 
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input 
                        id="duration" 
                        type="number" 
                        disabled
                        className="bg-muted"
                        {...register('durationSeconds', { valueAsNumber: true })} 
                    />
                    {errors.durationSeconds && <p className="text-xs text-destructive">{errors.durationSeconds.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                    <Input 
                        id="thumbnailUrl" 
                        placeholder="https://..." 
                        {...register('thumbnailUrl')} 
                    />
                    {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
                  file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                )}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="video/*"
                  disabled={isUploading}
                />
                
                {file ? (
                  <div className="space-y-2 w-full">
                    <div className="flex justify-center text-primary">
                      <FileVideo size={40} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate max-w-[200px] mx-auto">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    {!isUploading && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive h-7 px-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                            }}
                        >
                            <X size={14} className="mr-1" /> Remove
                        </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center text-muted-foreground">
                      <Upload size={40} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Click to upload video</p>
                      <p className="text-xs text-muted-foreground">MP4, WebM or OGG</p>
                    </div>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={!file || isUploading}
                onClick={handleSubmit(onSubmit)}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Publish Video'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default VideoUploadPage;