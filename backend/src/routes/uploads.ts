import { Router, Response } from "express";
import { upload } from "../middleware/upload";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

router.post("/avatar", authenticate, upload.single("avatar"), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  const avatarUrl = `/uploads/${req.file.filename}`;
  await prisma.user.update({ where: { id: req.userId }, data: { avatarUrl } });
  res.json({ avatarUrl });
});

export default router;
