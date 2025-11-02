import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('photo'))
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    console.log('Received registration data:', dto);
    console.log('Received photo:', photo);
    return this.authService.register(dto, photo);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
