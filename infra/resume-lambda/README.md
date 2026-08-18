# resume-signed-url Lambda

Mints a short-lived (60s) pre-signed S3 GET URL for the resume `.docx` on request. Keeps the S3 bucket
fully private — the raw bucket URL is never shipped in the frontend and the object cannot be hotlinked
or scraped from page source.

## 1. Lock down the S3 bucket

- Enable **Block Public Access** (all 4 settings) on `maansaabbucket`.
- Remove any public bucket policy / object ACL on `Resume/Ranbir_Singh_Maan_Resume_2026.docx`.
- Confirm: `curl -i https://maansaabbucket.s3.ap-south-1.amazonaws.com/Resume/Ranbir_Singh_Maan_Resume_2026.docx`
  should return `403 Forbidden` once locked down.

## 2. Create the IAM role

Trust policy: standard Lambda execution role trust policy.

Inline permissions policy (scoped to the single object only):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::maansaabbucket/Resume/Ranbir_Singh_Maan_Resume_2026.docx"
    }
  ]
}
```

Attach `AWSLambdaBasicExecutionRole` for CloudWatch logs.

## 3. Package and deploy

```bash
cd infra/resume-lambda
npm install
zip -r function.zip index.mjs node_modules package.json

aws lambda create-function \
  --function-name resume-signed-url \
  --runtime nodejs20.x \
  --handler index.handler \
  --role arn:aws:iam::<ACCOUNT_ID>:role/resume-signed-url-role \
  --zip-file fileb://function.zip \
  --timeout 5 \
  --memory-size 128 \
  --reserved-concurrent-executions 2 \
  --environment "Variables={RESUME_BUCKET_NAME=maansaabbucket,RESUME_BUCKET_REGION=ap-south-1,RESUME_OBJECT_KEY=Resume/Ranbir_Singh_Maan_Resume_2026.docx,ALLOWED_ORIGIN=https://your-production-domain.com}"
```

To update code later:

```bash
zip -r function.zip index.mjs node_modules package.json
aws lambda update-function-code --function-name resume-signed-url --zip-file fileb://function.zip
```

## 4. Add a Function URL

```bash
aws lambda create-function-url-config \
  --function-name resume-signed-url \
  --auth-type NONE \
  --cors '{"AllowOrigins":["https://your-production-domain.com"],"AllowMethods":["GET"],"AllowHeaders":["content-type"]}'
```

Grant public invoke permission (required for `AUTH_TYPE=NONE`):

```bash
aws lambda add-permission \
  --function-name resume-signed-url \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE
```

Copy the resulting Function URL into `frontend/src/app/core/config/resume.config.ts`.

## 5. Verify

```bash
curl -i -H "Origin: https://your-production-domain.com" https://<function-id>.lambda-url.ap-south-1.on.aws/
# -> 200, JSON { "url": "https://maansaabbucket.s3...X-Amz-Signature=...", "expiresIn": 60 }

curl -i -H "Origin: https://evil.example" https://<function-id>.lambda-url.ap-south-1.on.aws/
# -> 403 Forbidden (origin not allow-listed)
```

## Notes

- Update `ALLOWED_ORIGIN` (and redeploy the Function URL CORS config) if the production domain changes,
  or add `http://localhost:4200` temporarily while testing locally.
- `reserved-concurrent-executions` is capped at 2 to bound abuse/cost on this low-traffic personal site;
  raise it (or move to API Gateway + a WAF rate-based rule) if traffic grows.
- Rotating the resume file: just re-upload the object to the same S3 key — no code or infra changes needed.
