import cors from 'cors';

import { Request, Response, NextFunction } from 'express';
// Se estiver com "resolveJsonModule": true no tsconfig:
import adminEmails from './utils/admin-emails.json' assert { type: 'json' };


export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  const email = req.headers['x-user-email'];

  if (!email || typeof email !== 'string') {
    return res.status(401).json({ message: 'Admin email not provided' });
  }

  const isAuthorized = (adminEmails as string[]).includes(email);

  if (!isAuthorized) {
    return res.status(403).json({ message: 'Access denied: not an admin' });
  }

  next();
}
