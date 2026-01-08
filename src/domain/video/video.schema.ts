import { z } from 'zod';

export const videoMetadataSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sourceType: z.enum(['OWN', 'YOUTUBE']),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  durationSeconds: z.number().min(1, 'Duration must be at least 1 second'),
  isSafe: z.boolean(),
});

export type VideoMetadataInput = z.infer<typeof videoMetadataSchema>;

export interface Video {
  id: string;
  uuid: string;
  title: string;
  description: string;
  sourceType: 'OWN' | 'YOUTUBE';
  status: 'CREATED' | 'PROCESSING' | 'READY' | 'FAILED';
  durationSeconds: number;
  thumbnailUrl: string;
  isSafe: boolean;
  createdAt: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}
