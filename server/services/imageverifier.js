import { checkWithHive }   from './hivedetector.js';
import { analyzeMetadata } from './metadatadetector.js';
import { performELA }      from './eladetector.js';

export async function verifyImage(imageBuffer) {
  const [hive, metadata, ela] = await Promise.allSettled([
    checkWithHive(imageBuffer),
    analyzeMetadata(imageBuffer),
    performELA(imageBuffer),
  ]);

  const scores = {
    hive:     hive.status     === 'fulfilled' ? hive.value.aiScore     : null,
    metadata: metadata.status === 'fulfilled' ? metadata.value.aiScore : null,
    ela:      ela.status      === 'fulfilled' ? ela.value.aiScore      : null,
  };

  const weights = { hive: 0.6, metadata: 0.25, ela: 0.15 };
  let totalWeight = 0, weightedScore = 0;

  for (const [key, score] of Object.entries(scores)) {
    if (score !== null) {
      weightedScore += score * weights[key];
      totalWeight   += weights[key];
    }
  }

  const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

  return {
    isLikelyAI:      finalScore > 0.65,
    confidenceScore: Math.round(finalScore * 100),
    breakdown:       scores,
    flags:           metadata.status === 'fulfilled' ? metadata.value.flags : [],
    recommendation:  finalScore > 0.65 ? 'flag_for_review'
                   : finalScore > 0.40 ? 'warn_submitter'
                   : 'approve',
  };
}