import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateConversationInput {
  @ApiProperty({ 
    type: String, 
    format: 'uuid',
    example: [
      '03283ef7-7870-41a9-bc54-39ff889023b0',
      '6a724658-62a7-4c86-a3fa-48d1038c8eef',
      'f26dc62c-e86e-4b3a-a144-f6fa9bf39784'
    ] 
  })
  @IsArray()
  @IsUUID('all', { each: true })
  targetUserIds: UUID[];
  @ApiProperty({
    type: String,
    required: false,
    example: 'Chat with friends',
  })
  @IsString()
  @IsOptional()
  title?: string;
  
  @ApiProperty({
    type: String,
    required: false,
    format: 'hex color code',
    example: '#ff5733'
  })
  @IsString()
  @IsOptional()
  theme?: string;
  
  @ApiProperty({
    type: String,
    required: false,
    format: 'url',
    example: 'https://example.com/avatar.png'
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
