"use client";

import React from "react";
import { IUser } from "@/types/user.types";
import { AdminUserCard } from "./AdminUserCard";
import { Users } from "lucide-react";

interface AdminUsersListProps {
  users: IUser[];
  isLoading?: boolean;
  onRefresh: () => void;
}

export const AdminUsersList: React.FC<AdminUsersListProps> = ({
  users,
  isLoading = false,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No users found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <AdminUserCard key={user.id} user={user} onRefresh={onRefresh} />
      ))}
    </div>
  );
};
