"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const prisma_1 = __importDefault(require("../lib/prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadsDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadsDir))
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
const router = (0, express_1.Router)();
router.post("/avatar", auth_1.authenticate, upload_1.uploadImage.single("avatar"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No se subió ningún archivo" });
    const avatarUrl = `/uploads/${req.file.filename}`;
    await prisma_1.default.user.update({ where: { id: req.userId }, data: { avatarUrl } });
    res.json({ avatarUrl });
});
router.post("/certificate-bg", auth_1.authenticate, roles_1.requireAdmin, upload_1.upload.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No se subió ningún archivo" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});
router.post("/course-image", auth_1.authenticate, roles_1.requireAdmin, upload_1.uploadImage.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No se subió ningún archivo" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});
router.post("/certificate-font", auth_1.authenticate, roles_1.requireAdmin, upload_1.uploadFont.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No se subió ningún archivo" });
    const url = `/uploads/${req.file.filename}`;
    const name = req.file.originalname.replace(/\.[^.]+$/, "");
    res.json({ url, name });
});
exports.default = router;
//# sourceMappingURL=uploads.js.map