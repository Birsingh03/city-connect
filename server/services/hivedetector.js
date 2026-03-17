import axios from 'axios';
import FormData from 'form-data';

export async function checkWithHive(imageBuffer) {
  const form = new FormData();
  form.append('image', imageBuffer, { filename: 'image.jpg' });

  const res = await axios.post(
    'https://api.thehive.ai/api/v2/task/sync',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Token ${process.env.HIVE_API_KEY}`,
      },
    }
  );

  const classes = res.data.status[0].response.output[0].classes;
  const aiScore = classes.find(c => c.class === 'ai_generated')?.score || 0;
  return { source: 'hive', aiScore };
}