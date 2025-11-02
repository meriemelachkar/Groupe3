import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projet } from './schemas/projet.schema';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { MinioService } from '../minio.service';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectModel(Projet.name) private projetModel: Model<Projet>,
    private readonly minioService: MinioService
  ) {}

  async create(dto: CreateProjetDto, promoteurId: string, image?: Express.Multer.File): Promise<Projet> {
    let imageUrl: string | undefined;
    
    if (image) {
      try {
        imageUrl = await this.minioService.uploadFile(image, 'projets');
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image du projet:', error);
      }
    }

    const projet = new this.projetModel({ ...dto, promoteurId, imageUrl });
    return projet.save();
  }

  async findAll(): Promise<Projet[]> {
    return this.projetModel.find().populate('promoteurId', 'nom prenom email');
  }

  async findByPromoteur(promoteurId: string): Promise<Projet[]> {
    return this.projetModel.find({ promoteurId }).populate('promoteurId', 'nom prenom email');
  }

  async findOne(id: string): Promise<Projet> {
    const projet = await this.projetModel.findById(id);
    if (!projet) throw new NotFoundException('Projet non trouvé');
    return projet;
  }

  async update(id: string, dto: UpdateProjetDto, image?: Express.Multer.File): Promise<Projet> {
    let updateData = { ...dto };

    if (image) {
      try {
        const imageUrl = await this.minioService.uploadFile(image, 'projets');
        updateData = { ...updateData, imageUrl };
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image du projet:', error);
      }
    }

    const projet = await this.projetModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!projet) throw new NotFoundException('Projet non trouvé');
    return projet;
  }

  async remove(id: string): Promise<void> {
    const res = await this.projetModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Projet non trouvé');
  }
}
