import { SearchInput } from '@core/shared/application/search-input';
import { SortDirection } from '@core/shared/domain/repository';
import { IsArray, IsUUID, ValidateNested, validateSync } from 'class-validator';

export class ListGenresFilter {
  public name?: string;

  @IsUUID('4', { each: true })
  @IsArray()
  public categories_id?: string[];
}

export class ListGenresInput implements SearchInput<ListGenresFilter> {
  public page?: number;
  public per_page?: number;
  public sort?: string;
  public sort_dir?: SortDirection;

  @ValidateNested()
  public filter?: ListGenresFilter;
}

export class ValidateListGenresInput {
  static validate(input: ListGenresInput) {
    return validateSync(input);
  }
}
