export class ValidationError extends Error {
    public errors: any;
  
    constructor(message: string, errors?: any) {
      super(message);
      this.name = "ValidationError";
      this.errors = errors || [];
      Error.captureStackTrace(this, this.constructor);
    }
  
    getErrorResponse() {
      return {
        message: this.message,
        errors: this.errors,
      };
    }
  }
  