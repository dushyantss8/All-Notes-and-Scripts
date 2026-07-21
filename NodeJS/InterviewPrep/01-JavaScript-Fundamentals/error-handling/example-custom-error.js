/**
 * Custom AppError
 * Run: node error-handling/example-custom-error.js
 */
'use strict';

class AppError extends Error {
  constructor(message, { code, status = 500, cause } = {}) {
    super(message, { cause });
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

function getUser(id) {
  if (!id) throw new AppError('id required', { code: 'BAD_REQUEST', status: 400 });
  return { id };
}

try {
  getUser(null);
} catch (err) {
  if (err instanceof AppError) {
    console.log(err.status, err.code, err.message);
  }
}
