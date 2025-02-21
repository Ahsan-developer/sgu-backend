export interface AuthenticatedRequest extends Request {
  user?: { id: string };
  file?: Express.Multer.File;
}
