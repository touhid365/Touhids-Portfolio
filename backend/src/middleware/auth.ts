import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'NO_TOKEN_PROVIDED'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      })
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      })
    }
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: 'AUTH_FAILED'
    })
  }
}