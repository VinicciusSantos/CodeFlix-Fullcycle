import { Category } from "./category.entity";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { IRepository } from "../../shared/domain/repository/repository-interface";

export interface CategoryRepository extends IRepository<Category, Uuid> {
}
