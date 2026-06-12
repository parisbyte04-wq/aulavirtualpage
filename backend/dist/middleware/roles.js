"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
exports.requireStudent = requireStudent;
exports.wrapAsync = wrapAsync;
function requireAdmin(req, res, next) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Se requieren permisos de administrador" });
    }
    next();
}
function requireStudent(req, res, next) {
    if (req.userRole !== "student") {
        return res.status(403).json({ error: "Se requieren permisos de estudiante" });
    }
    next();
}
function wrapAsync(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=roles.js.map