export type ContentStatus =
  | "pending"
  | "analyzing"
  | "copy"
  | "design"
  | "awaiting_approval"
  | "approved"
  | "publishing"
  | "published"
  | "failed"
  | "rejected";

export interface DesignResult {
  processed_photo_url: string;
  type: string;
  dimensions: string;
  file_size_kb: number;
  r2_key: string;
}

export interface CopyResult {
  caption: string;
  hashtags: string[];
  cta: string;
  suggested_time: string;
}

export interface PublishResult {
  instagram_post_id: string | null;
  facebook_post_id: string | null;
  permalink: string | null;
  metrics?: Record<string, unknown>;
}

export interface ContentRequest {
  id: string;
  status: ContentStatus;
  photo_url: string;
  source_channel: string;
  celery_task_id: string | null;
  error_message: string | null;
  analysis_result: Record<string, unknown> | null;
  copy_result: CopyResult | null;
  design_result: DesignResult | null;
  publish_result: PublishResult | null;
  caption_edited: boolean;
  retry_count: number;
  content_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentRequestListResponse {
  items: ContentRequest[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
