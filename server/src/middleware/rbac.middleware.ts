import { Request, Response, NextFunction } from "express";
import { Role } from "../modules/users/user.types";
import { ForbiddenError, UnauthorizedError } from "../utils/ApiError";

/**
 * Role-Based Access Control (RBAC) middleware
 * Creates a middleware that checks if the authenticated user has one of the allowed roles
 *
 * @param allowedRoles - Roles that are permitted to access the route
 * @returns Express middleware function
 *
 * @example
 * // Allow only Admin
 * router.get("/users", authenticate, authorize(Role.ADMIN), controller);
 *
 * // Allow Admin and Logistics Officer
 * router.get("/orders", authenticate, authorize(Role.ADMIN, Role.LOGISTICS_OFFICER), controller);
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};
