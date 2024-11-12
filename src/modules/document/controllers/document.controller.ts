import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Fetch all documents',
    type: [Document],
  })
  async getAllDocuments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Document[]> {
    return await this.documentService.getAllDocuments(page, limit);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Fetch a document by ID',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocumentById(@Param('id') id: number): Promise<Document> {
    return await this.documentService.getDocumentById(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
    type: Document,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    const { title, content } = createDocumentDto;
    return this.documentService.createDocument(title, content);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocument(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const { title, content } = updateDocumentDto;
    return this.documentService.updateDocument(id, title, content);
  }
}
