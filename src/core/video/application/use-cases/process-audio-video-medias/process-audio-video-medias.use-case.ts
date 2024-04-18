import { ProcessAudioVideoMediasInput } from '@core/video/application/use-cases';
import { IUseCase } from '@core/shared/application';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import {
  IVideoRepository,
  Video,
  VideoId,
} from '@core/video/domain';
import { NotFoundError } from '@core/shared/domain/errors';
import { AudioVideoMediaStatus } from '@core/shared/domain/value-objects';

type ProcessAudioVideoMediasOutput = void;

export class ProcessAudioVideoMediasUseCase
  implements IUseCase<ProcessAudioVideoMediasInput, ProcessAudioVideoMediasOutput> {
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
  ) {
  }

  async execute(input: ProcessAudioVideoMediasInput) {
    const videoId = new VideoId(input.video_id);
    const video = await this.videoRepo.findById(videoId);

    if (!video) {
      throw new NotFoundError(input.video_id, Video);
    }

    if (input.field === 'trailer') {
      if (!video.trailer) {
        throw new Error('Trailer not found');
      }

      video.trailer =
        input.status === AudioVideoMediaStatus.COMPLETED
          ? video.trailer.complete(input.encoded_location)
          : video.trailer.fail();
    }

    if (input.field === 'video') {
      if (!video.video) {
        throw new Error('Video not found');
      }

      video.trailer =
        input.status === AudioVideoMediaStatus.COMPLETED
          ? video.video.complete(input.encoded_location)
          : video.video.fail();
    }

    await this.uow.do(async () => {
      await this.videoRepo.update(video);
    });
  }
}
