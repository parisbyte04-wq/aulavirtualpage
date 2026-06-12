"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const certs = await prisma_1.default.certificate.findMany({
        include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } },
        orderBy: { issuedAt: "desc" },
    });
    res.json(certs);
});
exports.default = router;
//# sourceMappingURL=adminCertificates.js.map