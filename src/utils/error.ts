
export const HTTP_STATUS = {
    SUC: 200,
    InvalidParam: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500
  }
  
  export const CODES = {
    NOT_FOUND: 'NOT_FOUND',
    INVALID_PARAMS: 'INVALID_PARAMS',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
  
    DATA_UNIQUENESS_CONFLICT: 'DATA_UNIQUENESS_CONFLICT'
  }
  
  class ServerError extends Error {
    errorCode: string;
    status: number;
    constructor(detailMsg: any, status: number, errorCode: string) {
      super(detailMsg);
      this.errorCode = errorCode;
      this.status = status;
    }
  }

  export function assert (condition: boolean, status: number, errorCode: string, details: any) {
    if (condition) {
      const detailMsg = JSON.stringify(details || {})
      const err = new ServerError(detailMsg, status, errorCode)
      err.name = 'AssertError'
      Error.captureStackTrace(err, assert)
      throw err
    }
  }
  