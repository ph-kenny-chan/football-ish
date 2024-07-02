import { isArray, transform, snakeCase } from 'lodash';

export default function convertToSnake(obj: Record<string, unknown>) {
  const result = transform(obj, (result: Record<string, unknown>, value: unknown, key: string, target) => {
    const snakeKey = isArray(target) ? key : snakeCase(key);
    result[snakeKey] = value;
  });
  return result;
}
