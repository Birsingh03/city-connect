import exifr from 'exifr';

export async function analyzeMetadata(imageBuffer) {
  const exif = await exifr.parse(imageBuffer, true);
  let suspicionScore = 0;
  const flags = [];

  if (!exif) {
    suspicionScore += 0.5;
    flags.push('No EXIF data found');
  } else {
    if (!exif.Make && !exif.Model)   { suspicionScore += 0.3; flags.push('No camera model'); }
    if (!exif.DateTimeOriginal)      { suspicionScore += 0.2; flags.push('No capture timestamp'); }
    if (exif.Software?.toLowerCase().includes('stable diffusion') ||
        exif.Software?.toLowerCase().includes('midjourney')) {
      suspicionScore = 1.0;
      flags.push('AI software signature detected');
    }
  }

  return { source: 'metadata', aiScore: Math.min(suspicionScore, 1), flags };
}