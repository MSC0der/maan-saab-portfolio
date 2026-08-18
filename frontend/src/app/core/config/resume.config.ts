/**
 * Endpoint of the "resume-signed-url" Lambda Function URL (see infra/resume-lambda).
 * It mints a short-lived pre-signed S3 URL on request — this endpoint itself is safe to
 * expose publicly, it never returns anything beyond a 60s-expiring download link.
 */
export const RESUME_SIGNED_URL_ENDPOINT = 'https://723nxqegjpqmxopypdbt4khddi0odrge.lambda-url.ap-south-1.on.aws/';
