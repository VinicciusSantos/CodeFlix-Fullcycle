import { InvalidUuidError } from '../uuid.vo';
import { validate as uuidValidate } from 'uuid';
import { CategoryId } from '@core/category/domain/category.aggregate';

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(CategoryId.prototype as any, 'validate');

  beforeEach(() => {
    validateSpy.mockClear();
  });

  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new CategoryId('invalid-uuid');
    }).toThrowError(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should create a valid uuid', () => {
    const uuid = new CategoryId();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should accept a valid uuid', () => {
    const uuid = new CategoryId('c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c');
    expect(uuid.id).toBe('c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
