import { ValueObject } from '@core/shared/domain/value-objects';
import { Either } from '../../shared/domain/either';

export enum CastMemberTypes {
  DIRECTOR = 1,
  ACTOR,
}

const allTypes: CastMemberTypes[] = [
  CastMemberTypes.DIRECTOR,
  CastMemberTypes.ACTOR,
];

export class CastMemberType extends ValueObject {
  constructor(public readonly type: CastMemberTypes) {
    super();
    this.validate();
  }

  public static create(
    value: CastMemberTypes,
  ): Either<CastMemberType, InvalidCastMemberTypeError> {
    return Either.safe(() => new CastMemberType(value));
  }

  public static createAnActor() {
    return CastMemberType.create(CastMemberTypes.ACTOR).ok;
  }

  public static createADirector() {
    return CastMemberType.create(CastMemberTypes.DIRECTOR).ok;
  }

  private validate(): void {
    if (!allTypes.includes(this.type)) {
      throw new InvalidCastMemberTypeError(this.type);
    }
  }
}

export class InvalidCastMemberTypeError extends Error {
  constructor(invalidType: unknown) {
    super(`Invalid cast member type: ${ invalidType }`);
    this.name = 'InvalidCastMemberTypeError';
  }
}
