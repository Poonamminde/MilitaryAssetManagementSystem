import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { IRegisterPayload, ILoginPayload } from "./auth.types";

export class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as IRegisterPayload;
      const user = await AuthService.register(payload);
      const token = AuthService.generateToken(user);

      // Set HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: AuthService.toAuthResponse(user),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login user
   */
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as ILoginPayload;
      const user = await AuthService.login(payload);
      const token = AuthService.generateToken(user);

      // Set HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: AuthService.toAuthResponse(user),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  static async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
      }

      res.status(200).json({
        success: true,
        data: AuthService.toAuthResponse(req.user),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user by clearing cookie
   */
  static async logout(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
