import { expect, test } from '@jest/globals';
const canDelete = (actor, resource) => actor.role === 'admin' || actor.id === resource.ownerId;
test('owner can delete', () => expect(canDelete({ id: 'u1', role: 'member' }, { ownerId: 'u1' })).toBe(true));
test('unrelated member cannot delete', () => expect(canDelete({ id: 'u2', role: 'member' }, { ownerId: 'u1' })).toBe(false));
