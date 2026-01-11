import { Request, Response, NextFunction } from 'express';
import { validate as uuidValidate } from 'uuid';

export const validateUUID = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!uuidValidate(id)) {
    res.status(400).json({ error: 'Invalid UUID format' });
    return;
  }

  next();
};
