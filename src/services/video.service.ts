import axios from 'axios';
import { videoRepository } from '@/repositories/video.repository';
import type { Video, VideoMetadataInput } from '@/domain/video/video.schema';
import type { ApiResponse } from '@/domain/auth/auth.schema';

export class VideoService {
  async uploadVideo(
    metadata: VideoMetadataInput, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<Video>> {
    // 1. Create metadata
    const createResponse = await videoRepository.createMetadata(metadata);
    if (!createResponse.success || !createResponse.data) {
      throw new Error(createResponse.message || 'Failed to create video metadata');
    }

    const video = createResponse.data;

    // 2. Get Signed URL
    const { uploadUrl, key } = await videoRepository.getUploadUrl(video.uuid, file.type);

    // 3. Upload to S3
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    // 4. Process video
    return videoRepository.processVideo(video.uuid, key);
  }
}

export const videoService = new VideoService();
