import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Se requieren permisos de administrador" });
  }
  next();
}

export function requireStudent(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "student") {
    return res.status(403).json({ error: "Se requieren permisos de estudiante" });
  }
  next();
}
