import api from '@/lib/axios';
import type { ApiResponse } from '@/domain/auth/auth.schema';
import type { Video, VideoMetadataInput, UploadUrlResponse } from '@/domain/video/video.schema';

export class VideoRepository {
  async createMetadata(data: VideoMetadataInput): Promise<ApiResponse<Video>> {
    return api.post('/admin/videos', data);
  }

  async getUploadUrl(videoId: string, contentType: string): Promise<UploadUrlResponse> {
    // Note: The response for this one seems to be a raw object based on your description, 
    // but usually it should be wrapped in ApiResponse. I'll follow your provided response example.
    const response = await api.post(`/admin/videos/${videoId}/upload`, { contentType });
    // axios interceptor returns response.data, so if backend returns raw {uploadUrl, key} it works.
    return response as unknown as UploadUrlResponse;
  }

  async processVideo(videoId: string, key: string): Promise<ApiResponse<Video>> {
    return api.post(`/admin/videos/${videoId}/process`, {
      key,
      mode: 'MP4_ONLY'
    });
  }
}

export const videoRepository = new VideoRepository();
