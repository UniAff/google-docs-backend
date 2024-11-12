import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';

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
    return await this.documentRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getDocumentById(id: number): Promise<Document> {
    return this.documentRepository.findOneOrFail({ where: { id } as any });
  }

  async createDocument(
    title: string,
    content: Record<string, any>,
  ): Promise<Document> {
    const document = this.documentRepository.create({
      title,
      content,
    } as DeepPartial<Document>);
    return await this.documentRepository.save(document);
  }

  async updateDocument(
    id: number,
    title: string,
    content: Record<string, any>,
  ): Promise<Document> {
    await this.documentRepository.update(id, { title, content } as any);
    return this.getDocumentById(id);
  }
}
