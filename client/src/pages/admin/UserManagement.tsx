import React, { useEffect, useState } from "react";
import { IUser, Role } from "../../types";
import { userService } from "../../services/user.service";
import Table from "../../components/ui/Table";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      setUpdatingId(userId);
      await userService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setToast({ message: "Role updated successfully", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Error updating role:", error);
      setToast({ message: "Failed to update role", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  const roleOptions = Object.values(Role).map((role) => ({
    value: role,
    label: role,
  }));

  const getRoleBadgeVariant = (role: Role) => {
    const map: Record<Role, "danger" | "info" | "warning"> = {
      [Role.ADMIN]: "danger",
      [Role.BASE_COMMANDER]: "info",
      [Role.LOGISTICS_OFFICER]: "warning",
    };
    return map[role];
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (user: IUser) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-accent font-bold text-xs border border-border-light">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "assignedBase",
      header: "Base",
      render: (user: IUser) => (
        <span className="text-text-secondary">{user.assignedBase}</span>
      ),
    },
    {
      key: "currentRole",
      header: "Current Role",
      render: (user: IUser) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
      ),
    },
    {
      key: "changeRole",
      header: "Change Role",
      render: (user: IUser) => (
        <div className="min-w-[180px]">
          <Select
            id={`role-${user._id}`}
            options={roleOptions}
            value={user.role}
            onChange={(e) =>
              handleRoleChange(user._id, e.target.value as Role)
            }
            disabled={updatingId === user._id}
          />
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (user: IUser) => (
        <span className="text-text-muted text-xs">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border rounded-lg">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-text-secondary font-medium">
            {users.length} Users
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`px-4 py-3 rounded-lg text-sm animate-slide-up ${
            toast.type === "success"
              ? "bg-success/10 border border-success/30 text-success"
              : "bg-danger/10 border border-danger/30 text-danger"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={users}
          keyExtractor={(user) => user._id}
          loading={loading}
          emptyMessage="No users found"
        />
      </div>
    </div>
  );
};

export default UserManagement;
