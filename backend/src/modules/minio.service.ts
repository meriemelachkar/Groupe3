import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Client;

  // Buckets utilisés
  private readonly bucketNames = {
    projets: 'projets',
    avatars: 'avatars',
    biens: 'biens',
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
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        this.logger.log(`Bucket "${bucketName}" créé`);
        await this.makeBucketPublic(bucketName);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de la vérification/création du bucket "${bucketName}":`, error);
      throw error;
    }
  }

  /**
   * Rendre un bucket public (lecture ouverte à tous)
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

    try {
      await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
      this.logger.log(`Bucket "${bucketName}" rendu public`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'application de la policy publique pour "${bucketName}":`, error);
      throw error;
    }
  }

  /**
   * Upload un fichier dans le bucket spécifié
   */
  async uploadFile(file: Express.Multer.File, bucket: keyof typeof this.bucketNames): Promise<string> {
    const bucketName = this.bucketNames[bucket];
    await this.ensureBucketExists(bucketName);

    const fileName = `${Date.now()}-${file.originalname}`;
    try {
      await this.minioClient.putObject(bucketName, fileName, file.buffer);
      this.logger.log(`Fichier "${fileName}" uploadé dans "${bucketName}"`);
      return `http://localhost:9000/${bucketName}/${fileName}`;
    } catch (error) {
      this.logger.error(`Erreur upload fichier "${fileName}" vers "${bucketName}":`, error);
      throw error;
    }
  }

  /**
   * Upload une photo de profil (avatars)
   */
  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, 'avatars');
  }

  /**
   * Upload un fichier projet
   */
  async uploadProjectFile(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, 'projets');
  }

  /**
   * Upload une image de bien immobilier
   */
  async uploadBienImage(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, 'biens');
  }

  /**
   * Supprime un fichier d'un bucket
   */
  async deleteFile(bucket: keyof typeof this.bucketNames, fileName: string) {
    const bucketName = this.bucketNames[bucket];
    try {
      await this.minioClient.removeObject(bucketName, fileName);
      this.logger.log(`Fichier "${fileName}" supprimé de "${bucketName}"`);
    } catch (error) {
      this.logger.error(`Erreur suppression fichier "${fileName}" de "${bucketName}":`, error);
      throw error;
    }
  }
}
