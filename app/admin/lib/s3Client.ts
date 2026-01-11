import {
    BucketAlreadyOwnedByYou,
    CreateBucketCommand,
    PutBucketPolicyCommand,
    S3Client,
} from "@aws-sdk/client-s3"

export const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_ACCESS_SECRET!,
    },
    forcePathStyle: process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE
        ? process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE === "true"
        : false,
})

/**
 * Try to create the S3 bucket if it doesn't exist and
 * set the access policy to public read
 */
export async function tryCreateBucket() {
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET!

    try {
        await s3Client.send(
            new CreateBucketCommand({
                Bucket: bucketName,
            })
        )
    } catch (e) {
        if (e instanceof BucketAlreadyOwnedByYou) {
            return
        }

        console.log(`Failed to create S3 bucket: ${e}`)
    }

    const accessPolicy = generatePolicyTemplate(bucketName)
    await s3Client.send(
        new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: accessPolicy,
        })
    )

    console.log(
        `Created S3 bucket ${bucketName} and assigned public read-only policy`
    )
}

/**
 * Generate a public read-only access policy template for a bucket
 */
function generatePolicyTemplate(bucketName: string): string {
    return `{
        "ID": "",
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "",
                "Effect": "Allow",
                "Principal": { "AWS": ["*"] },
                "Action": [
                    "s3:ListBucket",
                    "s3:GetObject",
                    "s3:GetBucketLocation",
                    "s3:GetObjectTagging"
                ],
                "NotAction": [],
                "Resource": ["arn:aws:s3:::${bucketName}/*"],
                "NotResource": [],
                "Condition": {}
            },
            {
                "Sid": "",
                "Effect": "Allow",
                "Principal": { "AWS": ["arn:aws:iam::*:root"] },
                "Action": [
                    "s3:DeleteObjectTagging",
                    "s3:DeleteObject",
                    "s3:PutObject",
                    "s3:PutObjectTagging"
                ],
                "NotAction": [],
                "Resource": ["arn:aws:s3:::${bucketName}/*"],
                "NotResource": [],
                "Condition": {}
            }
        ]
    }`
}
