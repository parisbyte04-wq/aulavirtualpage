import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function generateToken(user: { id: number; role: string; isSuperAdmin: boolean }) {
  return jwt.sign({ userId: user.id, role: user.role, isSuperAdmin: user.isSuperAdmin }, JWT_SECRET, { expiresIn: "7d" });
}

router.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin, phone: user.phone, avatarUrl: user.avatarUrl } });
  },
);

router.post(
  "/register",
  body("name").trim().notEmpty().withMessage("Nombre requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  validate,
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "El email ya está registrado" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role: "student" } });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: false, phone: null, avatarUrl: null } });
  },
);

router.get("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin, phone: user.phone, avatarUrl: user.avatarUrl });
});

router.put(
  "/profile",
  authenticate,
  body("name").optional().trim().notEmpty().withMessage("Nombre inválido"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  validate,
  async (req: AuthRequest, res: Response) => {
    const { name, email, phone } = req.body;
    const data: any = {};
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== req.userId) {
        return res.status(400).json({ error: "El email ya está en uso" });
      }
      data.email = email;
    }
    const user = await prisma.user.update({ where: { id: req.userId }, data });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin, phone: user.phone, avatarUrl: user.avatarUrl });
  },
);

router.put(
  "/password",
  authenticate,
  body("currentPassword").notEmpty().withMessage("Contraseña actual requerida"),
  body("newPassword").isLength({ min: 6 }).withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
  validate,
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Contraseña actual incorrecta" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.userId }, data: { password: hashed } });
    res.json({ success: true });
  },
);

router.put(
  "/avatar",
  authenticate,
  body("avatarUrl").notEmpty().withMessage("URL del avatar requerida"),
  validate,
  async (req: AuthRequest, res: Response) => {
    const { avatarUrl } = req.body;
    const user = await prisma.user.update({ where: { id: req.userId }, data: { avatarUrl } });
    res.json({ avatarUrl: user.avatarUrl });
  },
);

export default router;
