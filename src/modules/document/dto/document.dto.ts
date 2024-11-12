import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Title of the document' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the document in JSON format',
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  content: Record<string, any>;
}

export class UpdateDocumentDto {
  @ApiProperty({ description: 'Title of the document', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Content of the document in JSON format',
    type: Object,
    required: false,
  })
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;
}
