import { camelCase, isArray, transform, isObject } from 'lodash';

// not support nested fields
export default function convertToCamel(obj: Record<string, unknown>) {
  const result = transform(obj, (result: Record<string, unknown>, value: unknown, key: string, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);
    result[camelKey] = value;
  });
  return result;
}
