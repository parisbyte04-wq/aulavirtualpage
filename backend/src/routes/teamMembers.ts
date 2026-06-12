import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { requireAdmin, wrapAsync } from "../middleware/roles";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  res.json(members);
});

router.post("/", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const { name, role, bio, photoUrl, email, linkedin, order } = req.body;
  const member = await prisma.teamMember.create({
    data: { name, role, bio, photoUrl, email, linkedin, order: order ?? 0 },
  });
  res.json(member);
}));

router.put("/:id", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, role, bio, photoUrl, email, linkedin, order } = req.body;
  const member = await prisma.teamMember.update({
    where: { id },
    data: { name, role, bio, photoUrl, email, linkedin, order },
  });
  res.json(member);
}));

router.delete("/:id", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.teamMember.delete({ where: { id } });
  res.json({ success: true });
}));

export default router;
