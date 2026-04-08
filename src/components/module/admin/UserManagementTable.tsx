"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, toggleUserStatus, updateUserRole } from "@/services/user.service";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, UserCheck, UserX, Loader2, 
  MoreHorizontal, Mail, Shield, Calendar 
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagementTable() {
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", { searchTerm }],
    queryFn: () => {
      const query: Record<string, string> = {};
      if (searchTerm && searchTerm.trim()) {
        query.searchTerm = searchTerm;
      }
      return getAllUsers(query);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleUserStatus(userId, isActive),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    },
    onError: (error: Error) => {
      const errorMsg = error instanceof Error ? error.message : "Failed to update user status";
      toast.error(errorMsg);
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "ADMIN" | "MEMBER" }) =>
      updateUserRole(userId, role),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user role");
      }
    },
    onError: (error: Error) => {
      const errorMsg = error instanceof Error ? error.message : "Failed to update user role";
      toast.error(errorMsg);
    },
  });

  const handleToggleStatus = (userId: string, currentStatus: boolean, role: string) => {
    if (currentUser?.id === userId) {
      toast.error("You cannot change your own status.");
      return;
    }

    if (role === "ADMIN") {
      toast.error("Admin accounts cannot be deactivated via this panel.");
      return;
    }
    toggleMutation.mutate({ userId, isActive: !currentStatus });
  };

  const handleRoleChange = (userId: string, newRole: "ADMIN" | "MEMBER") => {
    if (currentUser?.id === userId) {
      toast.error("You cannot change your own role.");
      return;
    }

    roleMutation.mutate({ userId, role: newRole });
  };

  const users = data?.data ?? []; 

  const getStatusBadge = (user: { isActive: boolean; isDeleted: boolean }) => {
    if (user.isDeleted) {
      return (
        <Badge variant="destructive" className="border-none opacity-90">
          Deactivated
        </Badge>
      );
    }
    if (user.isActive) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-none dark:bg-emerald-900/30 dark:text-emerald-400">
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="font-bold">User</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Joined</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="size-5 animate-spin" /> Fetching community members...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={`transition-colors ${
                    user.isDeleted
                      ? "opacity-50 bg-red-50/30 dark:bg-red-900/5 hover:opacity-75"
                      : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center font-bold overflow-hidden ${
                        user.isDeleted
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {user.profile?.avatar ? (
                          <Image src={user.profile.avatar} alt={user.name} className="size-full object-cover" width={40} height={40} />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold leading-none mb-1 ${
                          user.isDeleted
                            ? "text-slate-500 line-through dark:text-slate-500"
                            : "text-slate-900 dark:text-white"
                        }`}>
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="size-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={user.role === "ADMIN" 
                        ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" 
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                      }
                    >
                      <Shield className="size-3 mr-1" /> {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5">
                       <Calendar className="size-3.5" />
                       {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {/* Role Selection */}
                        <div className="px-2 py-1.5">
                          <p className="text-xs font-semibold text-gray-600 mb-1.5">Change Role</p>
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => handleRoleChange(user.id, newRole as "ADMIN" | "MEMBER")}
                            disabled={roleMutation.isPending || currentUser?.id === user.id}
                          >
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <DropdownMenuSeparator />
                        
                        {/* Status Toggle */}
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(user.id, user.isActive, user.role)}
                          disabled={
                            toggleMutation.isPending ||
                            user.role === "ADMIN" ||
                            user.id === currentUser?.id
                          }
                        >
                          {toggleMutation.isPending ? (
                            <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> Updating...</>
                          ) : user.isActive && !user.isDeleted ? (
                            <><UserX className="size-4 mr-2 text-red-500" /> Deactivate Account</>
                          ) : (
                            <><UserCheck className="size-4 mr-2 text-emerald-500" /> Reactivate Account</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                  No users matched your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
