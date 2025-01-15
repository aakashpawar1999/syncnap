export const STATUS_CODES = {
  OK: {
    code: 200,
    status: 'success',
  },
  CREATED: {
    code: 201,
    status: 'success',
  },
  ACCEPTED: {
    code: 202,
    status: 'success',
  },
  NO_CONTENT: {
    code: 204,
    status: 'success',
  },
  BAD_REQUEST: {
    code: 400,
    status: 'error',
  },
  UNAUTHORIZED: {
    code: 401,
    status: 'error',
  },
  FORBIDDEN: {
    code: 403,
    status: 'error',
  },
  NOT_FOUND: {
    code: 404,
    status: 'error',
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    status: 'error',
  },
  CONFLICT: {
    code: 409,
    status: 'error',
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    status: 'error',
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    status: 'error',
  },
  NOT_IMPLEMENTED: {
    code: 501,
    status: 'error',
  },
  BAD_GATEWAY: {
    code: 502,
    status: 'error',
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    status: 'error',
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    status: 'error',
  },
};
