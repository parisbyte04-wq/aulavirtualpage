"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const validate_1 = require("../middleware/validate");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
router.post("/", (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Nombre requerido"), (0, express_validator_1.body)("email").isEmail().withMessage("Email inválido"), (0, express_validator_1.body)("subject").trim().notEmpty().withMessage("Asunto requerido"), (0, express_validator_1.body)("message").trim().notEmpty().withMessage("Mensaje requerido"), validate_1.validate, async (req, res) => {
    const { name, email, subject, message } = req.body;
    const contact = await prisma_1.default.contactMessage.create({
        data: { name, email, subject, message },
    });
    try {
        await (0, email_1.sendContactEmail)({ name, email, subject, message });
    }
    catch (err) {
        console.error("Error al enviar email:", err);
    }
    res.json({ success: true, message: "Mensaje recibido correctamente" });
});
router.get("/", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (_req, res) => {
    const messages = await prisma_1.default.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(messages);
}));
router.put("/:id/read", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const message = await prisma_1.default.contactMessage.update({
        where: { id },
        data: { read: true },
    });
    res.json(message);
}));
router.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.contactMessage.delete({ where: { id } });
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=contact.js.map