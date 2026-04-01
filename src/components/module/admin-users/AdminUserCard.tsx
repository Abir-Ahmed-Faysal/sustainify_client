"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Shield, Trash2, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";
import { toggleUserStatus, updateUserRole, deleteUser } from "@/services/user.service";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";

interface AdminUserCardProps {
  user: IUser;
  onRefresh: () => void;
}

export const AdminUserCard: React.FC<AdminUserCardProps> = ({ user, onRefresh }) => {
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const result = await toggleUserStatus(user.id);
      if (result.success) {
        toast.success(result.message);
        onRefresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    setIsLoadingRole(true);
    try {
      const result = await updateUserRole(user.id, newRole as "ADMIN" | "MEMBER");
      if (result.success) {
        toast.success(result.message);
        onRefresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoadingRole(false);
    }
  };

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        toast.success(result.message);
        onRefresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoadingDelete(false);
      setShowDeleteConfirm(false);
    }
  };

  const getRoleColor = (role: string) => {
    return role === "ADMIN" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Card className="p-5 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* Delete Confirmation Panel */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-50">
              <div className="bg-white p-6 rounded-lg space-y-4 m-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Delete User</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoadingDelete}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoadingDelete}
                  >
                    {isLoadingDelete ? "Deleting..." : "Delete User"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* User Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getRoleColor(user.role)}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Status and Dates */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div>
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <Badge className={getStatusColor(user.isActive)}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Joined</p>
              <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Profile Info */}
          {user.profile && (
            <div className="pt-2 border-t space-y-2">
              {user.profile.bio && (
                <div>
                  <p className="text-xs text-gray-500">Bio</p>
                  <p className="text-sm text-gray-700">{user.profile.bio}</p>
                </div>
              )}
              {user.profile.address && (
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-700">{user.profile.address}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t space-y-2">
            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase block">
                Change Role
              </label>
              <Select
                value={user.role}
                onValueChange={handleRoleChange}
                disabled={isLoadingRole}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status and Delete Buttons */}
            <div className="flex gap-2 pt-2">
              {/* Toggle Status Button */}
              <Button
                variant={user.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={handleToggleStatus}
                disabled={isLoadingStatus}
              >
                {isLoadingStatus ? (
                  <span className="opacity-50 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : user.isActive ? (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>

              {/* Delete Button */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoadingDelete}
              >
                {isLoadingDelete ? (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
