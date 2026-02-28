export enum FileMimeType {
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_JPG = 'image/jpg',
  IMAGE_WEBP = 'image/webp',

  VIDEO_MP4 = 'video/mp4',
  VIDEO_WEBM = 'video/webm',
  VIDEO_OGG = 'video/ogg',

  AUDIO_MP3 = 'audio/mpeg',
  AUDIO_WAV = 'audio/wav',
  AUDIO_OGG = 'audio/ogg',
  AUDIO_OPUS = 'audio/opus',

  PDF = 'application/pdf',
}

export const AVAILABLE_FILE_TYPES = Object.entries(FileMimeType).reduce(
  (acc, [key, value]) => {
    const category = key.split('_')[0];
    if (!acc[category]) acc[category] = [];
    acc[category].push(value);
    return acc;
  },
  {} as Record<string, string[]>,
);

export enum Timezone {
  AMERICA_NEW_YORK = 'America/New_York',
  AMERICA_CHICAGO = 'America/Chicago',
  AMERICA_DENVER = 'America/Denver',
  AMERICA_LOS_ANGELES = 'America/Los_Angeles',
  AMERICA_ANCHORAGE = 'America/Anchorage',
  PACIFIC_HONOLULU = 'Pacific/Honolulu',
}

export const timezoneOptions = [
  { label: 'America/New_York', value: Timezone.AMERICA_NEW_YORK },
  { label: 'America/Chicago', value: Timezone.AMERICA_CHICAGO },
  { label: 'America/Denver', value: Timezone.AMERICA_DENVER },
  { label: 'America/Los_Angeles', value: Timezone.AMERICA_LOS_ANGELES },
  { label: 'America/Anchorage', value: Timezone.AMERICA_ANCHORAGE },
  { label: 'Pacific/Honolulu', value: Timezone.PACIFIC_HONOLULU },
];

export enum Providers {
  TWILIO = 'twilio',
  RINGCENTRAL = 'ringcentral',
}

export enum DefaultStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}
