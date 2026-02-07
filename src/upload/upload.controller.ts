import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Controller("uploads")
export class UploadController {
  constructor() { }

  @Post("images")
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: "./uploads/images",
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
    })
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return files.map((file) => ({
      url: '/uploads/images/' + file.filename,
      filename: file.filename,
    }));
  }

  // ✅ Get all uploaded images
  @Get('images')
  async getAllImages() {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'images');

    try {
      const files = fs.readdirSync(uploadDir);

      return files.map((filename) => ({
        filename,
        url: `/uploads/images/${filename}`,
      }));
    } catch (error) {
      throw new BadRequestException('Unable to read images folder');
    }
  }
}
