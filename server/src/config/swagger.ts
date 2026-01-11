import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const port = process.env.PORT || 3001;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'REST API for managing tasks',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'tasks',
        description: 'Task operations',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique task identifier',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Learn Express',
              maxLength: 255,
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Learn Express, TypeORM and Swagger basics',
              maxLength: 1000,
            },
            completed: {
              type: 'boolean',
              description: 'Task completion status',
              example: false,
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation date',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateTaskDto: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title (required, cannot be empty)',
              example: 'Learn Express',
              minLength: 1,
              maxLength: 255,
            },
            description: {
              type: 'string',
              description: 'Task description (required, cannot be empty)',
              example: 'Learn Express, TypeORM and Swagger basics',
              minLength: 1,
              maxLength: 1000,
            },
            completed: {
              type: 'boolean',
              description: 'Task completion status (optional)',
              example: false,
              default: false,
            },
          },
        },
        UpdateTaskDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title (cannot be empty if provided)',
              example: 'Learn Express',
              minLength: 1,
              maxLength: 255,
            },
            description: {
              type: 'string',
              description: 'Task description (cannot be empty if provided)',
              example: 'Learn Express, TypeORM and Swagger basics',
              minLength: 1,
              maxLength: 1000,
            },
            completed: {
              type: 'boolean',
              description: 'Task completion status',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    paths: {
      '/tasks': {
        get: {
          tags: ['tasks'],
          summary: 'Get all tasks',
          responses: {
            '200': {
              description: 'Tasks list retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Task',
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['tasks'],
          summary: 'Create a new task',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateTaskDto',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Task created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/tasks/{id}': {
        put: {
          tags: ['tasks'],
          summary: 'Update a task',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
              description: 'Task UUID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateTaskDto',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Task updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['tasks'],
          summary: 'Delete a task',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
              description: 'Task UUID',
            },
          ],
          responses: {
            '204': {
              description: 'Task deleted successfully',
            },
            '404': {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  } as SwaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
