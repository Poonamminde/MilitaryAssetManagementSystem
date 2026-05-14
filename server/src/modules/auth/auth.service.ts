import jwt from "jsonwebtoken";
import User from "../users/user.model";
import { IUserDocument, IJwtPayload, Role } from "../users/user.types";
import { IRegisterPayload, ILoginPayload, IAuthResponse } from "./auth.types";
import { BadRequestError, UnauthorizedError } from "../../utils/ApiError";

export class AuthService {
  /**
   * Register a new user (default role: Base Commander)
   */
  static async register(payload: IRegisterPayload): Promise<IUserDocument> {
    const { name, email, password, assignedBase } = payload;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("A user with this email already exists");
    }

    // Create user with default role
    const user = await User.create({
      name,
      email,
      password,
      assignedBase,
      role: Role.BASE_COMMANDER,
    });

    return user;
  }

  /**
   * Login user and return user document
   */
  static async login(payload: ILoginPayload): Promise<IUserDocument> {
    const { email, password } = payload;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return user;
  }

  /**
   * Generate JWT token
   */
  static generateToken(user: IUserDocument): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload: IJwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Transform user document to auth response
   */
  static toAuthResponse(user: IUserDocument): IAuthResponse {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      assignedBase: user.assignedBase,
    };
  }
}
