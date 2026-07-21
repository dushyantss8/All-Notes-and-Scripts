import { expect, test } from '@jest/globals';
const repository = new Map(); // Replace with an isolated test database/container.
test('repository persists an entity', () => { repository.set('t1', { id: 't1', title: 'Learn tests' }); expect(repository.get('t1')).toMatchObject({ title: 'Learn tests' }); });
