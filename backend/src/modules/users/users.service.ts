import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(data: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  
  async findAll() {
    return this.userModel.find().select('-motDePasse'); // retourne tous les users sans le mot de passe
  }
  async findById(id: string) {
  return this.userModel.findById(id).select('-motDePasse');
}


}
