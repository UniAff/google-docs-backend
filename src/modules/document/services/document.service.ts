import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentService {
  private documentRepository: Repository<Document>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.documentRepository = this.entityManager.getRepository(Document);
  }

  async getAllDocuments(page: number, limit: number): Promise<Document[]> {
    const valueForSkip = (page - 1) * limit;

    return this.documentRepository.find({
      skip: valueForSkip,
      take: limit,
    });
  }

  async getDocumentById(id: number): Promise<Document> {
    return this.documentRepository.findOneOrFail({ where: { id } });
  }

  async createDocument(
    title: string,
    file: Express.Multer.File,
  ): Promise<Document> {
    if (!file) {
      throw new NotFoundException('File is not provided.');
    }

    const uploadPath = path.join('uploads', file.filename);

    try {
      const document = this.documentRepository.create({
        title,
        filePath: uploadPath,
      });

      return this.documentRepository.save(document);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error handling the file: ${error.message}`,
      );
    }
  }

  async updateDocument(
    id: number,
    title: string,
    file?: Express.Multer.File,
  ): Promise<Document> {
    const document = await this.getDocumentById(id);

    if (file) {
      const uploadPath = path.join('uploads', file.filename);

      if (document.filePath) {
        try {
          fs.unlinkSync(document.filePath);
        } catch (error) {
          throw new InternalServerErrorException(
            `Error deleting the old file: ${error.message}`,
          );
        }
      }

      document.filePath = uploadPath;
    }

    document.title = title;

    return this.documentRepository.save(document);
  }

  async deleteDocument(id: number): Promise<void> {
    const document = await this.getDocumentById(id);

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }

    if (document.filePath) {
      try {
        fs.unlinkSync(document.filePath);
      } catch (error) {
        throw new InternalServerErrorException(
          `Error deleting the file: ${error.message}`,
        );
      }
    }

    try {
      await this.documentRepository.remove(document);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting the document: ${error.message}`,
      );
    }
  }
}
