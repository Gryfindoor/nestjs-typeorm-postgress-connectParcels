import {  Module } from '@nestjs/common';
import { ParcelsModule } from './parcels/parcels.module';
import { typeormconfig } from './config/typeOrmg.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forRoot(typeormconfig),
    ParcelsModule,
    AuthModule,
  ],

})
export class AppModule {}
