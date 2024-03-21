import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import {
  Uuid,
  ValueObject,
} from '@core/shared/domain/value-objects';
import { CastMemberFakeBuilder } from '@core/cast-member/domain/cast-member-fake.builder';
import CastMemberValidatorFactory from '@core/cast-member/domain/cast-member.validator';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type.vo';

export interface CastMemberCreateCommand {
  name: string;
  type: CastMemberType;
}

export interface CastMemberConstructorProps extends CastMemberCreateCommand {
  cast_member_id?: CastMemberId;
  created_at?: Date;
}

export class CastMemberId extends Uuid {
}

export class CastMember extends AggregateRoot {
  public readonly cast_member_id: CastMemberId;
  public name: string;
  public type: CastMemberType;
  public readonly created_at: Date;

  public get entity_id(): ValueObject {
    return this.cast_member_id;
  }

  constructor(props: CastMemberConstructorProps) {
    super();
    this.cast_member_id = props.cast_member_id ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at ?? new Date();
  }

  public static create(props: CastMemberCreateCommand): CastMember {
    const castMember = new CastMember(props);
    castMember.validate(['name', 'type']);
    return castMember;
  }

  public static fake() {
    return CastMemberFakeBuilder;
  }

  public changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  public changeType(type: CastMemberType): void {
    this.type = type;
    this.validate(['type']);
  }

  public validate(fields?: string[]): void {
    const validator = CastMemberValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  public toJSON() {
    return {
      cast_member_id: this.cast_member_id.id,
      name: this.name,
      type: this.type.type,
      created_at: this.created_at,
    };
  }
}
