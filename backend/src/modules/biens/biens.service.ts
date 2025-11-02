import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BienImmobilier } from './schemas/bien.schema';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { MinioService } from '../minio.service';

@Injectable()
export class BiensService {
  constructor(
    @InjectModel(BienImmobilier.name) private readonly bienModel: Model<BienImmobilier>,
    private readonly minioService: MinioService
  ) {}

  async create(dto: CreateBienDto, proprietaireId: string): Promise<BienImmobilier> {
    // L'imageUrl est maintenant incluse dans le dto après l'upload
    const bien = new this.bienModel({
      ...dto,
      proprietaireId
    });
    return bien.save();
  }

  async findAll(): Promise<BienImmobilier[]> {
    return this.bienModel.find().populate('proprietaireId', 'nom prenom email');
  }

  async findByProprietaire(proprietaireId: string): Promise<BienImmobilier[]> {
    return this.bienModel.find({ proprietaireId }).populate('proprietaireId', 'nom prenom email');
  }

  async findById(id: string): Promise<BienImmobilier> {
    const bien = await this.bienModel.findById(id);
    if (!bien) throw new NotFoundException('Bien immobilier non trouvé');
    return bien;
  }

  async update(id: string, dto: UpdateBienDto, image?: Express.Multer.File): Promise<BienImmobilier> {
    let updateData = { ...dto };

    if (image) {
      try {
        const imageUrl = await this.minioService.uploadBienImage(image);
        updateData = { ...updateData, imageUrl };
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image du bien:', error);
      }
    }

    const bien = await this.bienModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!bien) throw new NotFoundException('Bien non trouvé');
    return bien;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bienModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Bien non trouvé');
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.minioService.uploadBienImage(file);
  }
}
