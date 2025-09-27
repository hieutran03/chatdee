import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ConversationOutput } from 'src/application/conversations/dtos/conversation.output';
import { ErrorResponseDto } from 'src/shared/common/dtos/error-response.dto';
import {
  OffsetBasedMetaDto,
  OffsetBasedPageDto,
} from 'src/shared/common/dtos/offset-based-page.dto';
import { SuccessResponseDto } from 'src/shared/common/dtos/success-response.dto';

export enum ConversationOperation {
  create = 'create',
  addMember = 'addMember',
  removeMember = 'removeMember',
  getConversations = 'getConversations',
}
const swaggerResponse = {
  [ConversationOperation.create]: [
    ApiExtraModels(SuccessResponseDto, ErrorResponseDto, ConversationOutput),
    ApiResponse({
      status: 201,
      description: 'Conversation created successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              statusCode: { example: 201 },
              data: { $ref: getSchemaPath(ConversationOutput) },
            },
          },
        ],
      },
    }),
  ],
  [ConversationOperation.addMember]: [
    ApiResponse({
      status: 200,
      description: 'Member added successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              statusCode: { example: 200 },
              data: { example: null },
            },
          },
        ],
      },
    }),
  ],
  [ConversationOperation.removeMember]: [
    ApiResponse({
      status: 200,
      description: 'Member removed successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              statusCode: { example: 200 },
              data: { example: null },
            },
          },
        ],
      },
    }),
  ],
  [ConversationOperation.getConversations]: [
    ApiExtraModels(
      SuccessResponseDto,
      ErrorResponseDto,
      OffsetBasedPageDto,
      OffsetBasedMetaDto,
      ConversationOutput,
    ),
    ApiResponse({
      status: 200,
      description: 'List of conversations',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              statusCode: { example: 200 },
              data: {
                allOf: [
                  { $ref: getSchemaPath(OffsetBasedPageDto) },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(ConversationOutput) },
                      },
                      meta: { $ref: getSchemaPath(OffsetBasedMetaDto) },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  ],
};

export const ConversationResponseSwagger = (option: ConversationOperation) => {
  const decorators = swaggerResponse[option];
  return applyDecorators(...decorators);
};
