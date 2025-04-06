/**
 * Class untuk menangani custom application error
 * Mempermudah penanganan error yang operasional
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Untuk membedakan operational errors dari programming errors

    // Menyesuaikan stack trace (tidak menambahkan constructor ini ke error stack)
    Error.captureStackTrace(this, this.constructor);
  }
}