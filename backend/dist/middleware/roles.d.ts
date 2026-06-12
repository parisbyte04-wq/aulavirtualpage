import { Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./auth";
export declare function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireStudent(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function wrapAsync(fn: RequestHandler): RequestHandler;
//# sourceMappingURL=roles.d.ts.map