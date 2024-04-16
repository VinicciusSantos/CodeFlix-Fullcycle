import { ValueObject } from './value-object';

export abstract class ImageMedia extends ValueObject {
  readonly name: string;
  readonly location: string;

  public get url(): string {
    return `${this.location}/${this.name}`;
  }

  constructor({ name, location }: { name: string; location: string }) {
    super();
    this.name = name;
    this.location = location;
  }

  public toJSON() {
    return {
      name: this.name,
      location: this.location,
    };
  }
}
