export * from './hobby-tags';
export * from './reactions';

/**
 * App-wide constants
 */
export const APP_NAME = 'チー牛農場';
export const APP_DESCRIPTION =
  '静かなインターネット - 外向的な社交プレッシャーのない、安心できるオンライン空間';

/**
 * Pagination
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Content limits
 */
export const MAX_POST_LENGTH = 2000;
export const MAX_COMMENT_LENGTH = 500;
export const MAX_BIO_LENGTH = 300;
export const MAX_USERNAME_LENGTH = 30;
export const MAX_DISPLAY_NAME_LENGTH = 50;
export const MAX_IMAGES_PER_POST = 4;

/**
 * File upload limits
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
