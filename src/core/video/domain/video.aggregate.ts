import { CategoryId } from '../../category/domain/category.aggregate';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { CastMemberId } from '../../cast-member/domain/cast-member.aggregate';
import {
  Banner,
  Rating,
  Thumbnail,
  ThumbnailHalf,
  Trailer,
  VideoMedia,
  VideoValidatorFactory,
  VideoFakeBuilder,
} from '@core/video/domain';
import {
  AudioVideoMediaStatus,
  Uuid,
} from '@core/shared/domain/value-objects';
import {
  VideoCreatedEvent,
  VideoAudioMediaReplaced,
} from '@core/video/domain/domain-events';

export type VideoConstructorProps = {
  video_id?: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;
  is_published: boolean;

  banner?: Banner;
  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;
  trailer?: Trailer;
  video?: VideoMedia;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;
  created_at?: Date;
};

export type VideoCreateCommand = {
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;

  banner?: Banner;
  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;
  trailer?: Trailer;
  video?: VideoMedia;

  categories_id: CategoryId[];
  genres_id: GenreId[];
  cast_members_id: CastMemberId[];
};

export class VideoId extends Uuid {
}

export class Video extends AggregateRoot {
  video_id: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;
  is_published: boolean;

  banner: Banner | null;
  thumbnail: Thumbnail | null;
  thumbnail_half: ThumbnailHalf | null;
  trailer: Trailer | null;
  video: VideoMedia | null;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;

  readonly created_at: Date;

  public get entity_id() {
    return this.video_id;
  }

  constructor(props: VideoConstructorProps) {
    super();
    this.video_id = props.video_id ?? new VideoId();
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;
    this.rating = props.rating;
    this.is_opened = props.is_opened;
    this.is_published = props.is_published;

    this.banner = props.banner ?? null;
    this.thumbnail = props.thumbnail ?? null;
    this.thumbnail_half = props.thumbnail_half ?? null;
    this.trailer = props.trailer ?? null;
    this.video = props.video ?? null;

    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
    this.created_at = props.created_at ?? new Date();

    this.registerHandler(
      VideoCreatedEvent.name,
      this.onVideoCreated.bind(this),
    );
    this.registerHandler(
      VideoAudioMediaReplaced.name,
      this.onAudioVideoMediaReplaced.bind(this),
    );
  }

  public static fake() {
    return VideoFakeBuilder;
  }

  public static create(props: VideoCreateCommand) {
    const video = new Video({
      ...props,
      categories_id: new Map(props.categories_id.map((id) => [id.id, id])),
      genres_id: new Map(props.genres_id.map((id) => [id.id, id])),
      cast_members_id: new Map(props.cast_members_id.map((id) => [id.id, id])),
      is_published: false,
    });
    video.validate(['title']);
    video.applyEvent(
      new VideoCreatedEvent({
        video_id: video.video_id,
        title: video.title,
        description: video.description,
        year_launched: video.year_launched,
        duration: video.duration,
        rating: video.rating,
        is_opened: video.is_opened,
        is_published: video.is_published,
        banner: video.banner,
        thumbnail: video.thumbnail,
        thumbnail_half: video.thumbnail_half,
        trailer: video.trailer,
        video: video.video,
        categories_id: Array.from(video.categories_id.values()),
        genres_id: Array.from(video.genres_id.values()),
        cast_members_id: Array.from(video.cast_members_id.values()),
        created_at: video.created_at,
      }),
    );
    return video;
  }

  public changeTitle(title: string): void {
    this.title = title;
    this.validate(['title']);
  }

  public changeDescription(description: string): void {
    this.description = description;
  }

  public changeYearLaunched(yearLaunched: number): void {
    this.year_launched = yearLaunched;
  }

  public changeDuration(duration: number): void {
    this.duration = duration;
  }

  public changeRating(rating: Rating): void {
    this.rating = rating;
  }

  public markAsOpened(): void {
    this.is_opened = true;
  }

  public markAsNotOpened(): void {
    this.is_opened = false;
  }

  public replaceBanner(banner: Banner): void {
    this.banner = banner;
  }

  public replaceThumbnail(thumbnail: Thumbnail): void {
    this.thumbnail = thumbnail;
  }

  public replaceThumbnailHalf(thumbnailHalf: ThumbnailHalf): void {
    this.thumbnail_half = thumbnailHalf;
  }

  public replaceTrailer(trailer: Trailer): void {
    this.trailer = trailer;
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: trailer,
        media_type: 'trailer',
      }),
    );
  }

  public replaceVideo(video: VideoMedia): void {
    this.video = video;
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: video,
        media_type: 'video',
      }),
    );
  }

  public addCategoryId(categoryId: CategoryId): void {
    this.categories_id.set(categoryId.id, categoryId);
  }

  public removeCategoryId(categoryId: CategoryId): void {
    this.categories_id.delete(categoryId.id);
  }

  public syncCategoriesId(categoriesId: CategoryId[]): void {
    if (!categoriesId.length) {
      throw new Error('Categories id is empty');
    }

    this.categories_id = new Map(categoriesId.map((id) => [id.id, id]));
  }

  public addGenreId(genreId: GenreId): void {
    this.genres_id.set(genreId.id, genreId);
  }

  public removeGenreId(genreId: GenreId): void {
    this.genres_id.delete(genreId.id);
  }

  public syncGenresId(genresId: GenreId[]): void {
    if (!genresId.length) {
      throw new Error('Genres id is empty');
    }
    this.genres_id = new Map(genresId.map((id) => [id.id, id]));
  }

  public addCastMemberId(castMemberId: CastMemberId): void {
    this.cast_members_id.set(castMemberId.id, castMemberId);
  }

  public removeCastMemberId(castMemberId: CastMemberId): void {
    this.cast_members_id.delete(castMemberId.id);
  }

  public syncCastMembersId(castMembersId: CastMemberId[]): void {
    if (!castMembersId.length) {
      throw new Error('Cast Members id is empty');
    }
    this.cast_members_id = new Map(castMembersId.map((id) => [id.id, id]));
  }

  public validate(fields?: string[]): boolean {
    const validator = VideoValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  public toJSON() {
    return {
      video_id: this.video_id.id,
      title: this.title,
      description: this.description,
      year_launched: this.year_launched,
      duration: this.duration,
      rating: this.rating,
      is_opened: this.is_opened,
      is_published: this.is_published,
      banner: this.banner?.toJSON(),
      thumbnail: this.thumbnail?.toJSON(),
      thumbnail_half: this.thumbnail_half?.toJSON(),
      trailer: this.trailer?.toJSON(),
      video: this.video?.toJSON(),
      categories_id: Array.from(this.categories_id.values()).map((id) => id.id),
      genres_id: Array.from(this.genres_id.values()).map((id) => id.id),
      cast_members_id: Array.from(this.cast_members_id.values()).map(
        (id) => id.id,
      ),
      created_at: this.created_at,
    };
  }

  private onVideoCreated(_event: VideoCreatedEvent) {
    if (!this.is_published) {
      this.tryMarkAsPublished();
    }
  }

  private onAudioVideoMediaReplaced(_event: VideoAudioMediaReplaced) {
    if (!this.is_published) {
      this.tryMarkAsPublished();
    }
  }

  private tryMarkAsPublished(): void {
    if (
      this.trailer &&
      this.video &&
      this.trailer.status === AudioVideoMediaStatus.COMPLETED &&
      this.video.status === AudioVideoMediaStatus.COMPLETED
    ) {
      this.is_published = true;
    }
  }
}
