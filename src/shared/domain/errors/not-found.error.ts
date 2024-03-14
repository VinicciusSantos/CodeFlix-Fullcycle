import { Entity } from "../entity";

export class NotFoundError extends Error {
  constructor(
    id: unknown[] | unknown,
    entityClass: new (...args: unknown[]) => Entity,
  ) {
    const idsMessage = Array.isArray(id) ? id.join(", ") : id;
    super(`${ entityClass.name } Not Found using ID ${ idsMessage }`);
    this.name = "NotFoundError";
  }
}
