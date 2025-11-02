import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { MinioService } from '../minio.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly minioService: MinioService,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll() {
    return this.userModel.find().select('-motDePasse'); // sans le mot de passe
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-motDePasse');
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    try {
      const fileUrl = await this.minioService.uploadFile(file, 'avatars');

      const user = await this.userModel
        .findByIdAndUpdate(
          userId,
          { photoUrl: fileUrl },
          { new: true },
        )
        .select('-motDePasse');

      return user;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo de profil:', error);
      throw new Error('Impossible de mettre à jour la photo de profil');
    }
  }
}
