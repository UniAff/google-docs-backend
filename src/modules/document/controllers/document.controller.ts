import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Res,
  BadRequestException,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from '../services/document.service';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Document } from '../entities/document.entity';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';

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
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllDocuments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<Document[]> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be valid numbers.');
    }

    try {
      return await this.documentService.getAllDocuments(
        pageNumber,
        limitNumber,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching documents: ${error.message}`,
      );
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Fetch a document by ID',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getDocumentById(@Param('id') id: number): Promise<Document> {
    try {
      return await this.documentService.getDocumentById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching document: ${error.message}`,
      );
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
    type: Document,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'File not provided' })
  @ApiResponse({ status: 500, description: 'Error handling the file' })
  async createDocument(
    @Body('title') title: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    try {
      return await this.documentService.createDocument(title, file);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('File is not provided.');
      }
      throw new InternalServerErrorException(
        `Error creating document: ${error.message}`,
      );
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Error updating the document' })
  async updateDocument(
    @Param('id') id: number,
    @Body('title') title: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Document> {
    try {
      return await this.documentService.updateDocument(id, title, file);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Document not found.');
      }
      throw new InternalServerErrorException(
        `Error updating document: ${error.message}`,
      );
    }
  }

  @Get(':id/content')
  @ApiResponse({
    status: 200,
    description: 'Fetch the content of the document',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
        },
      },
      'application/json': {
        schema: {
          type: 'string',
        },
      },
      'text/html': {
        schema: {
          type: 'string',
        },
      },
      'application/octet-stream': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'File or document not found' })
  @ApiResponse({
    status: 500,
    description: 'Error while retrieving file content',
  })
  async getFileContent(@Param('id') id: number, @Res() res: Response) {
    try {
      const document = await this.documentService.getDocumentById(id);

      if (!document || !document.filePath) {
        throw new NotFoundException('File not found or file path is undefined');
      }

      const filePath = document.filePath;

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('File not found on disk');
      }

      const fileExtension = path.extname(filePath).toLowerCase();

      if (['.txt', '.json', '.html'].includes(fileExtension)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return res.send(fileContent);
      }

      return res.sendFile(filePath, { root: '.' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Error retrieving file content: ${error.message}`,
      );
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({
    status: 500,
    description: 'Error deleting the document or associated file',
  })
  async deleteDocument(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.documentService.deleteDocument(id);
      return { message: `Document with ID ${id} deleted successfully.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Error deleting document: ${error.message}`,
      );
    }
  }
}
