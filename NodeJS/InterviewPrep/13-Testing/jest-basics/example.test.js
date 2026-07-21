import { describe, expect, test } from '@jest/globals';
describe('total', () => { test('adds amounts', () => expect([10, 15].reduce((sum, n) => sum + n, 0)).toBe(25)); });
