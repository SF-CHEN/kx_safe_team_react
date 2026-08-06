const MIME_EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/tiff': 'tif',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/flac': 'flac',
  'audio/ogg': 'ogg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const MEDIA_DEFAULT_EXT: Record<string, string> = {
  text: 'txt',
  image: 'jpg',
  audio: 'mp3',
  video: 'mp4',
};

export function parseContentDispositionFilename(header?: string): string | null {
  if (!header) return null;
  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return utf8Match[1].trim();
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch ? plainMatch[1].trim() : null;
}

export function inferMediaTypeFromAlgorithmKey(algorithmKey?: string): string | null {
  if (!algorithmKey) return null;
  const prefix = String(algorithmKey).split('_')[0];
  return ['text', 'image', 'audio', 'video'].includes(prefix) ? prefix : null;
}

export function isBuiltinSampleText(sample: Record<string, unknown>): boolean {
  if (sample.input_type === 'text' || sample.sample_type === 'text') return true;
  if (sample.input_type === 'file' || sample.sample_type === 'file') return false;
  return Boolean(String(sample.text ?? '').trim())
    && !sample.download_url
    && !sample.file_name
    && !sample.filename;
}

export function getSampleDisplayName(sample: Record<string, unknown>): string {
  return String(
    sample.file_name
      ?? sample.filename
      ?? sample.name
      ?? sample.description
      ?? sample.sample_id
      ?? '内置样例',
  );
}

export function guessMimeFromFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    ogg: 'audio/ogg',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    txt: 'text/plain',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return (ext && map[ext]) || 'application/octet-stream';
}

export function resolveSampleFileName(sample: Record<string, unknown>, blob: Blob): string {
  const explicit = sample.file_name ?? sample.filename;
  if (typeof explicit === 'string' && explicit.trim()) return explicit.trim();

  const ext = sample.file_ext
    ? (String(sample.file_ext).startsWith('.') ? String(sample.file_ext) : `.${sample.file_ext}`)
    : null;
  if (sample.name && ext) return `${sample.name}${ext}`;

  const extFromSampleMime = sample.mime_type ? MIME_EXT_MAP[String(sample.mime_type)] : null;
  const base = String(sample.name ?? sample.sample_id ?? 'sample');
  if (extFromSampleMime) return `${base}.${extFromSampleMime}`;

  const extFromBlob = MIME_EXT_MAP[blob?.type];
  if (extFromBlob) return `${base}.${extFromBlob}`;

  const mediaType = String(
    sample.media_type
      ?? inferMediaTypeFromAlgorithmKey(sample.algorithm_key as string | undefined)
      ?? 'image',
  );
  const defaultExt = MEDIA_DEFAULT_EXT[mediaType] ?? 'bin';
  return `${base}.${defaultExt}`;
}

export function resolveSampleMimeType(
  sample: Record<string, unknown>,
  blob: Blob,
  fileName: string,
): string {
  if (sample.mime_type) return String(sample.mime_type);
  if (blob.type && blob.type !== 'application/octet-stream') return blob.type;
  return guessMimeFromFileName(fileName);
}
