import { Router, Response } from "express";
import { upload, uploadImage, uploadFont } from "../middleware/upload";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";
import prisma from "../lib/prisma";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const router = Router();

router.post("/avatar", authenticate, uploadImage.single("avatar"), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  const avatarUrl = `/uploads/${req.file.filename}`;
  await prisma.user.update({ where: { id: req.userId }, data: { avatarUrl } });
  res.json({ avatarUrl });
});

router.post("/certificate-bg", authenticate, requireAdmin, upload.single("file"), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

router.post("/course-image", authenticate, requireAdmin, uploadImage.single("file"), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

router.post("/certificate-font", authenticate, requireAdmin, uploadFont.single("file"), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  const url = `/uploads/${req.file.filename}`;
  const name = req.file.originalname.replace(/\.[^.]+$/, "");
  res.json({ url, name });
});

export default router;
