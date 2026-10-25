import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.RESUME_BUCKET_REGION;
const BUCKET = process.env.RESUME_BUCKET_NAME;
const KEY = process.env.RESUME_OBJECT_KEY;
// One origin, or several separated by commas (e.g. the live site plus localhost).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const EXPIRES_IN_SECONDS = 60;

const s3 = new S3Client({ region: REGION });

// NOTE: CORS headers (Access-Control-Allow-*) are intentionally NOT set here.
// The Lambda Function URL's own CORS configuration (see infra/resume-lambda/README.md,
// `create-function-url-config`) already injects them. Adding them again here produced
// duplicate Access-Control-Allow-Origin headers, which browsers reject outright.
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const handler = async (event) => {
  const origin = event.headers?.origin ?? event.headers?.Origin;

  // Preflight — Function URL CORS config answers this itself in most cases,
  // but respond cleanly if it reaches the handler.
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: JSON_HEADERS, body: '' };
  }

  // Defense in depth: reject any request that didn't come from the allowed
  // origin, even though the Function URL's CORS config already restricts
  // which origins get a usable response in the browser.
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return {
      statusCode: 403,
      headers: JSON_HEADERS,
      body: JSON.stringify({ message: 'Forbidden' }),
    };
  }

  if (!BUCKET || !KEY || ALLOWED_ORIGINS.length === 0) {
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ message: 'Server misconfigured' }),
    };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      ResponseContentDisposition: 'attachment; filename="Ranbir_Singh_Maan_Resume.pdf"',
      ResponseContentType: 'application/pdf',
    });

    const url = await getSignedUrl(s3, command, { expiresIn: EXPIRES_IN_SECONDS });

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ url, expiresIn: EXPIRES_IN_SECONDS }),
    };
  } catch (error) {
    console.error('Failed to presign resume URL', error);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ message: 'Failed to generate download link' }),
    };
  }
};
