export interface AuthenticatedRequest extends Request {
  user?: { id: string };
  file?: Express.Multer.File;
}
export interface AuthenticatedUserRequest extends Request {
  user?: { id: string };
}
export interface IMessage extends Document {
  participant_id: string;
  text: string;
  timestamp: Date;
}

export interface IChat extends Document {
  participants: string[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}
