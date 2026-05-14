import User from "./user.model";
import { IUserDocument, IUserResponse, Role } from "./user.types";
import { NotFoundError, BadRequestError } from "../../utils/ApiError";

export class UserService {
  /**
   * Get all users (for Admin user management)
   */
  static async getAllUsers(): Promise<IUserResponse[]> {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return users.map((user) => this.toUserResponse(user));
  }

  /**
   * Get a user by ID
   */
  static async getUserById(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.toUserResponse(user);
  }

  /**
   * Update user role (Admin only)
   */
  static async updateUserRole(
    userId: string,
    newRole: Role
  ): Promise<IUserResponse> {
    if (!Object.values(Role).includes(newRole)) {
      throw new BadRequestError("Invalid role specified");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.toUserResponse(user);
  }

  /**
   * Transform user document to response object
   */
  private static toUserResponse(user: IUserDocument): IUserResponse {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      assignedBase: user.assignedBase,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
