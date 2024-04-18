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
} from '@nestjs/common';

import { CreateVideoDto } from './dto';
import {
  CreateVideoUseCase,
  GetVideoUseCase,
  UpdateVideoUseCase,
  UploadAudioVideoMediasUseCase,
} from '@core/video/application/use-cases';

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

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateVideoDto: any,
  ) {
  }

  @Patch(':id/upload')
  uploadFile(
    @UploadedFiles()
    @Body()
      data,
  ) {
  }
}
