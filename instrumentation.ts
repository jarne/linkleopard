import { tryCreateBucket } from "./app/admin/lib/s3Client"

export function register() {
    tryCreateBucket()
}
