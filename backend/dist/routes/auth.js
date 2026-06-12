"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, isSuperAdmin: user.isSuperAdmin }, JWT_SECRET, { expiresIn: "7d" });
}
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("Email inválido"), (0, express_validator_1.body)("password").notEmpty().withMessage("Contraseña requerida"), validate_1.validate, async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Credenciales inválidas" });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ error: "Credenciales inválidas" });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin, phone: user.phone, avatarUrl: user.avatarUrl } });
});
router.post("/register", (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Nombre requerido"), (0, express_validator_1.body)("email").isEmail().withMessage("Email inválido"), (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"), validate_1.validate, async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing)
        return res.status(400).json({ error: "El email ya está registrado" });
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({ data: { name, email, password: hashed, role: "student" } });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: false, phone: null, avatarUrl: null } });
});
router.get("/profile", auth_1.authenticate, async (req, res) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: req.userId } });
    if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin, phone: user.phone, avatarUrl: user.avatarUrl });
});
router.put("/profile", auth_1.authenticate, (0, express_validator_1.body)("name").optional().trim().notEmpty().withMessage("Nombre inválido"), (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email inválido"), validate_1.validate, async (req, res) => {
    const { name, email, phone } = req.body;
    const data = {};
    if (name)
        data.name = name;
    if (phone !== undefined)
        data.phone = phone;
    if (email) {
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing && existing.id !== req.userId) {
            return res.status(400).json({ error: "El email ya está en uso" });
        }
        data.email = email;
    }
    const user = await prisma_1.default.user.update({ where: { id: req.userId }, data });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin, phone: user.phone, avatarUrl: user.avatarUrl });
});
router.put("/password", auth_1.authenticate, (0, express_validator_1.body)("currentPassword").notEmpty().withMessage("Contraseña actual requerida"), (0, express_validator_1.body)("newPassword").isLength({ min: 6 }).withMessage("La nueva contraseña debe tener al menos 6 caracteres"), validate_1.validate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { id: req.userId } });
    if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
    const valid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!valid)
        return res.status(400).json({ error: "Contraseña actual incorrecta" });
    const hashed = await bcryptjs_1.default.hash(newPassword, 10);
    await prisma_1.default.user.update({ where: { id: req.userId }, data: { password: hashed } });
    res.json({ success: true });
});
router.put("/avatar", auth_1.authenticate, (0, express_validator_1.body)("avatarUrl").notEmpty().withMessage("URL del avatar requerida"), validate_1.validate, async (req, res) => {
    const { avatarUrl } = req.body;
    const user = await prisma_1.default.user.update({ where: { id: req.userId }, data: { avatarUrl } });
    res.json({ avatarUrl: user.avatarUrl });
});
exports.default = router;
//# sourceMappingURL=auth.js.map