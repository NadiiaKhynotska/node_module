import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { UploadedFile } from "express-fileupload";
import * as path from "path";

import { configs } from "../configs/config";
import { EFileTypes } from "../enums/EFileTypes";

class S3Service {
  constructor(
    private s3Client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_S3_ACCESS_KEY,
        secretAccessKey: configs.AWS_S3_SECRET_ACCESS_KEY,
      },
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    fileType: EFileTypes,
    itemId: string,
  ) {
    const filePath = this.buildPath(file.name, fileType, itemId);
    await this.s3Client.send(
      new PutObjectCommand({
        Key: filePath,
        Bucket: configs.AWS_S3_BUCKET,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: "public-read",
      }),
    );
    return filePath;
  }

  public async deleteFile(fileKey: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Key: fileKey,
        Bucket: configs.AWS_S3_BUCKET,
      }),
    );
  }

  public buildPath(
    fileName: string,
    fileType: EFileTypes,
    itemId: string,
  ): string {
    return `${fileType}/${itemId}/${crypto.randomUUID()}${path.extname(
      fileName,
    )}`;
  }
}

export const s3Service = new S3Service();
