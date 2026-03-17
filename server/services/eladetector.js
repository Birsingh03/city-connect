import { Jimp } from 'jimp';

export async function performELA(imageBuffer) {
  const original = await Jimp.read(imageBuffer);
  const recompressed = original.clone();
  const recompressedBuffer = await recompressed.quality(75).getBufferAsync(Jimp.MIME_JPEG);
  const recompImg = await Jimp.read(recompressedBuffer);

  let totalDiff = 0;
  let pixelCount = 0;

  original.scan(0, 0, original.bitmap.width, original.bitmap.height, (x, y, idx) => {
    const r1 = original.bitmap.data[idx];
    const r2 = recompImg.bitmap.data[idx];
    totalDiff += Math.abs(r1 - r2);
    pixelCount++;
  });

  const avgDiff = totalDiff / pixelCount;
  const aiScore = avgDiff < 3 ? 0.6 : avgDiff < 8 ? 0.3 : 0.1;

  return { source: 'ela', aiScore, avgDiff };
}