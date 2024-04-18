import { IUseCase } from '@core/shared/application';
import { UploadAudioVideoMediaInput } from '@core/video/application/use-cases/upload-audio-video-media/upload-audio-video-media.input';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import {
  IVideoRepository,
  Trailer,
  Video,
  VideoId,
  VideoMedia,
} from '@core/video/domain';
import { IStorage } from '@core/shared/application/storage.interface';
import { NotFoundError } from '@core/shared/domain/errors';
import { EntityValidationError } from '@core/shared/domain/validators';
import { ApplicationService } from '@core/shared/application/application.service';

export type UploadAudioVideoMediaOutput = void;

export class UploadAudioVideoMediasUseCase
  implements IUseCase<UploadAudioVideoMediaInput, UploadAudioVideoMediaOutput> {
  constructor(
    private appService: ApplicationService,
    private videoRepo: IVideoRepository,
    private storage: IStorage,
  ) {
  }

  async execute(
    input: UploadAudioVideoMediaInput,
  ): Promise<UploadAudioVideoMediaOutput> {
    const video = await this.videoRepo.findById(new VideoId(input.video_id));
    if (!video) {
      throw new NotFoundError(input.video_id, Video);
    }

    const audioVideoMediaMap = {
      trailer: Trailer,
      video: VideoMedia,
    };

    const audioMediaClass = audioVideoMediaMap[input.field] as
      | typeof Trailer
      | typeof VideoMedia;

    const [audioVideoMedia, errorAudioMedia] = audioMediaClass
      .createFromFile({
        ...input.file,
        video_id: video.video_id,
      })
      .asArray();

    if (errorAudioMedia) {
      throw new EntityValidationError([{ [input.field]: [errorAudioMedia.message] }]);
    }

    audioVideoMedia instanceof Trailer && video.replaceTrailer(audioVideoMedia);
    audioVideoMedia instanceof VideoMedia &&
    video.replaceVideo(audioVideoMedia);

    await this.storage.store({
      data: input.file.data,
      id: audioVideoMedia.raw_url,
      mime_type: input.file.mime_type,
    });

    await this.appService.run(async () => {
      return this.videoRepo.update(video);
    });
  }
}
