import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentController } from './controllers/document.controller';
import { DocumentService } from './services/document.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const title = req.body.title || 'untitled';
          const timestamp = Date.now();
          const fileExtension = path.extname(file.originalname);

          const uniqueName = `${title}_${timestamp}${fileExtension}`;
          cb(null, uniqueName);
        },
      }),
    }),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
