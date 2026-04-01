"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";

interface AdminUserFilterProps {
  onSearchChange: (search: string) => void;
  onRoleFilterChange: (role: string) => void;
  onStatusFilterChange: (status: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const AdminUserFilter: React.FC<AdminUserFilterProps> = ({
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onRefresh,
  isRefreshing = false,
}) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    onRoleFilterChange(value === "all" ? "" : value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusFilterChange(value === "all" ? "" : value);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Search Users</label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Filter by Role</label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Filter by Status</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
