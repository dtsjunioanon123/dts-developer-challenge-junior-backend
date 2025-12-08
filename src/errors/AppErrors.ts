// ------------------------------
// Base App Error
// ------------------------------
export class AppError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ------------------------------
// 4xx — Client errors
// ------------------------------
export class MissingValueError extends AppError {
  constructor(field: string) {
    super(`${field} is required`, 400);
  }
}

export class InvalidValueError extends AppError {
  constructor(field: string, msg?: string) {
    super(msg ?? `Invalid value for ${field}`, 400);
  }
}

export class ConstraintError extends AppError {
  constructor(message: string, constraint?: string) {
    super(message, 409, { constraint });
  }
}

// ------------------------------
// 5xx — Server errors
// ------------------------------
export class DatabaseConnectionError extends AppError {
  constructor(details?: any) {
    super("Database connection failed", 500, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database error occurred", details?: any) {
    super(message, 500, details);
  }
}
