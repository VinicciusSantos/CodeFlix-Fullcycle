import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  UploadedFiles,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import {
  CreateVideoDto,
  UpdateVideoDto,
} from './dto';
import {
  CreateVideoUseCase,
  GetVideoUseCase,
  UpdateVideoInput,
  UpdateVideoUseCase,
  UploadAudioVideoMediaInput,
  UploadAudioVideoMediasUseCase,
} from '@core/video/application/use-cases';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class VideosController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updateUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(GetVideoUseCase)
  private getUseCase: GetVideoUseCase;

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const { id } = await this.createUseCase.execute(createVideoDto);
    return await this.getUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'banner',
        maxCount: 1,
      },
      {
        name: 'thumbnail',
        maxCount: 1,
      },
      {
        name: 'thumbnail_half',
        maxCount: 1,
      },
      {
        name: 'trailer',
        maxCount: 1,
      },
      {
        name: 'video',
        maxCount: 1,
      },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateVideoDto: any,
    @UploadedFiles()
      files: {
      banner?: File[];
      thumbnail?: File[];
      thumbnail_half?: File[];
      trailer?: File[];
      video?: File[];
    },
  ) {
    const hasFiles = files ? Object.keys(files).length : false;
    const hasData = Object.keys(updateVideoDto).length > 0;

    if (hasFiles && hasData) {
      throw new BadRequestException('Files and data cannot be sent together');
    }

    if (hasData) {
      const data = await new ValidationPipe({ errorHttpStatusCode: 422 })
        .transform(updateVideoDto, {
          metatype: UpdateVideoDto,
          type: 'body',
        });
      const input = new UpdateVideoInput({ id, ...data });
      await this.updateUseCase.execute(input);
    }

    if (Object.keys(files).length > 1) {
      throw new BadRequestException('Only one file can be sent');
    }

    const hasAudioVideoMedia = files.trailer?.length || files.video?.length;
    if (hasAudioVideoMedia) {
      const [fieldField] = Object.keys(files);
      const [file] = files[fieldField];

      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fieldField as any,
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      };

      const input = await new ValidationPipe({ errorHttpStatusCode: 422 })
        .transform(dto, {
          metatype: UploadAudioVideoMediaInput,
          type: 'body',
        });

      await this.uploadAudioVideoMedia.execute(input);
    } else {
      //use case upload image media
    }
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id/upload')
  async uploadFile(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @UploadedFiles()
      files: {
      banner?: File[];
      thumbnail?: File[];
      thumbnail_half?: File[];
      trailer?: File[];
      video?: File[];
    },
  ) {
    const hasMoreThanOneFile = Object.keys(files).length > 1;

    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    const hasAudioVideoMedia = files.trailer?.length || files.video?.length;
    const fieldField = Object.keys(files)[0];
    const file = files[fieldField][0];

    if (hasAudioVideoMedia) {
      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fieldField as any,
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      };

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadAudioVideoMediaInput,
        type: 'body',
      });

      await this.uploadAudioVideoMedia.execute(input);
    } else {
      //use case upload image media
    }
    return await this.getUseCase.execute({ id });
  }
}
