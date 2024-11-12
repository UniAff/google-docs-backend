import { Module } from '@nestjs/common';
import { DocumentController } from './controllers/document.controller';
import { DocumentService } from './services/document.service';

@Module({
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
