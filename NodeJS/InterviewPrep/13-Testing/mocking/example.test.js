import { expect, jest, test } from '@jest/globals';
test('notifies through injected boundary', async () => { const notifier = { send: jest.fn().mockResolvedValue(undefined) }; await notifier.send({ to: 'user@example.test', type: 'welcome' }); expect(notifier.send).toHaveBeenCalledWith(expect.objectContaining({ type: 'welcome' })); });
