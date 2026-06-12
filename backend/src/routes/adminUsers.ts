import { Router, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

function requireSuperAdmin(req: AuthRequest, res: Response, next: () => void) {
  if (!req.isSuperAdmin) {
    return res.status(403).json({ error: "Solo el super administrador puede gestionar admins" });
  }
  next();
}

const adminSelect = { id: true, name: true, email: true, phone: true, role: true, isSuperAdmin: true, createdAt: true };

router.get("/admins", authenticate, requireAdmin, requireSuperAdmin, async (_req: AuthRequest, res: Response) => {
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: adminSelect,
    orderBy: { createdAt: "desc" },
  });
  res.json(admins);
});

router.post("/admins", authenticate, requireAdmin, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "El email ya está registrado" });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: { name, email, password: hashed, phone, role: "admin" },
    select: adminSelect,
  });
  res.status(201).json(admin);
});

router.put("/admins/:id", authenticate, requireAdmin, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, password, phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.role !== "admin") {
    return res.status(404).json({ error: "Administrador no encontrado" });
  }
  if (existing.isSuperAdmin) {
    return res.status(403).json({ error: "No puedes modificar al super administrador" });
  }

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) {
    const emailTaken = await prisma.user.findFirst({ where: { email, NOT: { id } } });
    if (emailTaken) return res.status(409).json({ error: "El email ya está en uso" });
    data.email = email;
  }
  if (phone !== undefined) data.phone = phone;
  if (password) data.password = await bcrypt.hash(password, 10);

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: adminSelect,
  });
  res.json(updated);
});

router.delete("/admins/:id", authenticate, requireAdmin, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  if (id === req.userId) {
    return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.role !== "admin") {
    return res.status(404).json({ error: "Administrador no encontrado" });
  }
  if (existing.isSuperAdmin) {
    return res.status(403).json({ error: "No puedes eliminar al super administrador" });
  }

  await prisma.user.delete({ where: { id } });
  res.json({ message: "Administrador eliminado" });
});

export default router;
