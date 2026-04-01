"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, toggleUserStatus } from "@/services/user.service";
import { IUser } from "@/types/user.types";
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
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserManagementTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", { searchTerm }],
    queryFn: () => getAllUsers({ searchTerm }),
  });

  const mutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleUserStatus(userId, isActive),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    },
  });

  const handleToggleStatus = (userId: string, currentStatus: boolean, role: string) => {
    if (role === "ADMIN") {
      toast.error("Admin accounts cannot be deactivated via this panel.");
      return;
    }
    mutation.mutate({ userId, isActive: !currentStatus });
  };

  const users = data?.data?.data ?? [];

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
                <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 overflow-hidden">
                        {user.profile?.avatar ? (
                          <img src={user.profile.avatar} alt={user.name} className="size-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
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
                    {user.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-none dark:bg-emerald-900/30 dark:text-emerald-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="border-none opacity-80">
                        Suspended
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(user.id, user.isActive, user.role)}
                          disabled={mutation.isPending || user.role === "ADMIN"}
                        >
                          {user.isActive ? (
                            <><UserX className="size-4 mr-2 text-red-500" /> Deactivate Account</>
                          ) : (
                            <><UserCheck className="size-4 mr-2 text-emerald-500" /> Activate Account</>
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
