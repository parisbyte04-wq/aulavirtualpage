import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const certs = await prisma.certificate.findMany({
    include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } },
    orderBy: { issuedAt: "desc" },
  });
  res.json(certs);
});

export default router;
