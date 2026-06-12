"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const router = (0, express_1.Router)();
function requireSuperAdmin(req, res, next) {
    if (!req.isSuperAdmin) {
        return res.status(403).json({ error: "Solo el super administrador puede gestionar admins" });
    }
    next();
}
const adminSelect = { id: true, name: true, email: true, phone: true, role: true, isSuperAdmin: true, createdAt: true };
router.get("/admins", auth_1.authenticate, roles_1.requireAdmin, requireSuperAdmin, async (_req, res) => {
    const admins = await prisma_1.default.user.findMany({
        where: { role: "admin" },
        select: adminSelect,
        orderBy: { createdAt: "desc" },
    });
    res.json(admins);
});
router.post("/admins", auth_1.authenticate, roles_1.requireAdmin, requireSuperAdmin, async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
    }
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "El email ya está registrado" });
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const admin = await prisma_1.default.user.create({
        data: { name, email, password: hashed, phone, role: "admin" },
        select: adminSelect,
    });
    res.status(201).json(admin);
});
router.put("/admins/:id", auth_1.authenticate, roles_1.requireAdmin, requireSuperAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, password, phone } = req.body;
    const existing = await prisma_1.default.user.findUnique({ where: { id } });
    if (!existing || existing.role !== "admin") {
        return res.status(404).json({ error: "Administrador no encontrado" });
    }
    if (existing.isSuperAdmin) {
        return res.status(403).json({ error: "No puedes modificar al super administrador" });
    }
    const data = {};
    if (name !== undefined)
        data.name = name;
    if (email !== undefined) {
        const emailTaken = await prisma_1.default.user.findFirst({ where: { email, NOT: { id } } });
        if (emailTaken)
            return res.status(409).json({ error: "El email ya está en uso" });
        data.email = email;
    }
    if (phone !== undefined)
        data.phone = phone;
    if (password)
        data.password = await bcryptjs_1.default.hash(password, 10);
    const updated = await prisma_1.default.user.update({
        where: { id },
        data,
        select: adminSelect,
    });
    res.json(updated);
});
router.delete("/admins/:id", auth_1.authenticate, roles_1.requireAdmin, requireSuperAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.userId) {
        return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
    }
    const existing = await prisma_1.default.user.findUnique({ where: { id } });
    if (!existing || existing.role !== "admin") {
        return res.status(404).json({ error: "Administrador no encontrado" });
    }
    if (existing.isSuperAdmin) {
        return res.status(403).json({ error: "No puedes eliminar al super administrador" });
    }
    await prisma_1.default.user.delete({ where: { id } });
    res.json({ message: "Administrador eliminado" });
});
exports.default = router;
//# sourceMappingURL=adminUsers.js.map