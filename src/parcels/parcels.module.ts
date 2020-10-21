import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import {  ParcelsController } from './parcels.controller';
import { ParcelsRepository } from './parcels.repository';
import { UsersService } from './parcels.service';



@Module({
  imports: [TypeOrmModule.forFeature([ParcelsRepository]), AuthModule],
  providers: [UsersService],
  controllers: [ParcelsController]
})
export class ParcelsModule {}
