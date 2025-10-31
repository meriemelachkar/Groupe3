import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BienImmobilier } from './schemas/bien.schema';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';

@Injectable()
export class BiensService {
  constructor(@InjectModel(BienImmobilier.name) private readonly bienModel: Model<BienImmobilier>) {}

  async create(dto: CreateBienDto, proprietaireId: string): Promise<BienImmobilier> {
    const bien = new this.bienModel({ ...dto, proprietaireId });
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

  async update(id: string, dto: UpdateBienDto): Promise<BienImmobilier> {
    const bien = await this.bienModel.findByIdAndUpdate(id, dto, { new: true });
    if (!bien) throw new NotFoundException('Bien non trouvé');
    return bien;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bienModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Bien non trouvé');
  }
}
