import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Passport adds the isAuthenticated() method to the request object
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // User is logged in via Passport → continue
  } else {
    res.status(401).json({ message: "Unauthorized: Please log in" });
  }
};

export default requireAuth;