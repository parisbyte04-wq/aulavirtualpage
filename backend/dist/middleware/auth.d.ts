import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: number;
    userRole?: string;
    isSuperAdmin?: boolean;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map