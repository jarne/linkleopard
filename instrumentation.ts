import { tryCreateBucket } from "./app/admin/lib/s3/s3FirstSetup"

export function register() {
    tryCreateBucket()
}
