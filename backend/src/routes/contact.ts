import { Router, Request, Response } from "express";
import { body } from "express-validator";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendContactEmail } from "../services/email";

const router = Router();

router.post(
  "/",
  body("name").trim().notEmpty().withMessage("Nombre requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("subject").trim().notEmpty().withMessage("Asunto requerido"),
  body("message").trim().notEmpty().withMessage("Mensaje requerido"),
  validate,
  async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (err) {
      console.error("Error al enviar email:", err);
    }

    res.json({ success: true, message: "Mensaje recibido correctamente" });
  },
);

router.get("/", authenticate, async (_req: Request, res: Response) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(messages);
});

router.put("/:id/read", authenticate, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  res.json(message);
});

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.contactMessage.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
