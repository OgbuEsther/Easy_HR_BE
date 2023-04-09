export enum HttpCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  ACCEPTED_REST = 305,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILBLE = 503,
  GATEWAY_TIMEOUT = 504,
  NETWORK_TIMEOUT = 599,
}

interface errorArgs {
  name?: string;
  isOperational?: boolean;
  message: string;
  httpCode: HttpCode;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean = true;
  public readonly httpCode: HttpCode;
  constructor(args: errorArgs) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = args.httpCode;
    this.name = args.name || "Error";

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
