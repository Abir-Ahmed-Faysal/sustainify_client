"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users } from "lucide-react";
import { AdminUsersList, AdminUserFilter } from "@/components/module/admin-users";
import { getAllUsers } from "@/services/user.service";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPage: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isActive: "",
  });

  // Fetch users with current filters
  const fetchUsers = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);
    try {
      const query: Record<string, string> = {
        page: String(pageNum),
        limit: String(pagination.limit),
      };

      // Add search parameter
      if (filters.search) {
        query.searchTerm = filters.search;
      }

      // Add role filter
      if (filters.role) {
        query.role = filters.role;
      }

      // Add isActive filter
      if (filters.isActive !== "") {
        query.isActive = filters.isActive;
      }

      const result = await getAllUsers(query);

      if (result.success && result.data) {
        setUsers(result.data.data);
        setPagination(result.data.meta);
      } else {
        toast.error(result.message || "Failed to fetch users");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit]);

  // Load users on component mount and when filters change
  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.role, filters.isActive, pagination.limit]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleRoleFilterChange = (role: string) => {
    setFilters((prev) => ({ ...prev, role }));
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => ({ ...prev, isActive: status }));
  };

  const handleRefresh = () => {
    fetchUsers(pagination.page);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" />
          User Management
        </h1>
        <p className="text-gray-600">Manage platform users, roles, and permissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Current Page</p>
            <p className="text-2xl font-bold text-gray-900">
              {pagination.page} / {pagination.totalPage}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Showing</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.length} of {pagination.limit}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Per Page</p>
            <p className="text-2xl font-bold text-gray-900">{pagination.limit}</p>
          </div>
        </Card>
      </div>

      {/* Error Alert */}
      {!isLoading && users.length === 0 && !filters.search && !filters.role && !filters.isActive && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">No users found on this platform</p>
          </div>
        </Card>
      )}

      {/* Filter Section */}
      <AdminUserFilter
        onSearchChange={handleSearchChange}
        onRoleFilterChange={handleRoleFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
      />

      {/* Users List */}
      <AdminUsersList users={users} isLoading={isLoading} onRefresh={handleRefresh} />

      {/* Pagination Controls */}
      {pagination.totalPage > 1 && !isLoading && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPage) }).map((_, idx) => {
              let pageNum;
              if (pagination.totalPage <= 5) {
                pageNum = idx + 1;
              } else if (pagination.page <= 3) {
                pageNum = idx + 1;
              } else if (pagination.page >= pagination.totalPage - 2) {
                pageNum = pagination.totalPage - 4 + idx;
              } else {
                pageNum = pagination.page - 2 + idx;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
