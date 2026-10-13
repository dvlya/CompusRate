import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Database } from './database.model.js';

@Injectable()
export class DatabaseService {
  private readonly filePath: string;

  constructor(configService: ConfigService) {
    this.filePath = configService.getOrThrow<string>('DATA_FILE_PATH');
  }

  private async ensureFileExists(): Promise<void> {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !('code' in error) ||
        error.code !== 'ENOENT'
      ) {
        throw error;
      }

      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const initialData: Database = { places: [], reviews: [] };
      await fs.writeFile(
        this.filePath,
        JSON.stringify(initialData, null, 2),
        'utf8',
      );
    }
  }

  async readDatabase(): Promise<Database> {
    await this.ensureFileExists();

    try {
      const content = await fs.readFile(this.filePath, 'utf8');
      const data: Database = JSON.parse(content);

      if (
        !data ||
        !Array.isArray(data.places) ||
        !Array.isArray(data.reviews)
      ) {
        throw new InternalServerErrorException('Invalid data file structure.');
      }
      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException('Invalid JSON data file.');
      }
      throw error;
    }
  }

  async writeDatabase(data: Database): Promise<void> {
    await this.ensureFileExists();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
