import { describe, it, expect } from 'vitest';
import { toKebabCase, toPascalCase, toCamelCase } from '@/../tools/codegen/name-utils';

describe('name utils', () => {
  it('kebab', () => {
    expect(toKebabCase('My NewPage')).toBe('my-new-page');
  });
  it('pascal', () => {
    expect(toPascalCase('my new page')).toBe('MyNewPage');
  });
  it('camel', () => {
    expect(toCamelCase('my new page')).toBe('myNewPage');
  });
});
