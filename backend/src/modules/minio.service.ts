import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private readonly bucketNames = {
    projets: 'projets',
    profiles: 'avatars', 
  };

  constructor() {
    this.minioClient = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  /**
   * Vérifie si le bucket existe, sinon le crée et le rend public
   */
  private async ensureBucketExists(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket "${bucketName}" créé`);

      // Appliquer la policy publique
      await this.makeBucketPublic(bucketName);
    }
  }

  /**
   * Applique une policy publique pour permettre l'accès en lecture à tous
   */
  private async makeBucketPublic(bucketName: string) {
    const publicPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
    console.log(`Bucket "${bucketName}" rendu public`);
  }

  /**
   * Upload un fichier dans le bucket spécifié
   */
  async uploadFile(file: Express.Multer.File, bucketName: 'projets' | 'avatars'): Promise<string> {
    await this.ensureBucketExists(bucketName);
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(bucketName, fileName, file.buffer);
    return `http://localhost:9000/${bucketName}/${fileName}`;
  }

  /**
   * Upload une photo de profil
   */
  async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, 'avatars');
  }

  /**
   * Upload un fichier projet
   */
  async uploadProjectFile(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, 'projets');
  }

  /**
   * Supprime un fichier d'un bucket
   */
  async deleteFile(bucketName: 'projets' | 'avatars', fileName: string) {
    await this.minioClient.removeObject(bucketName, fileName);
  }
}
