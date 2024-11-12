import { Module } from '@nestjs/common';
import { DocumentModule } from './modules/document/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfig,
    }),
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
