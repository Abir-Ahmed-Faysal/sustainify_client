"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBlogs, deleteBlog } from "@/services/blog.service";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, 
  Loader2, CheckCircle2, MoreHorizontal 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BlogsManagementPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["blogs", { limit: 100 }], // Fetch all for management
    queryFn: () => getAllBlogs({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
        toast.success("Blog post deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="size-10 animate-spin text-emerald-600" />
        <p className="text-slate-500 font-medium">Loading blog database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Blogs Management</h1>
          <p className="text-slate-500 mt-1">
            Create, edit, and keep track of all sustainability stories.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
          <Link href="/admin/dashboard/blogs-management/create" className="flex items-center gap-2">
            <Plus className="size-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">All Stories</CardTitle>
              <Badge variant="outline" className="bg-white dark:bg-slate-800">
                 {data?.data?.length || 0} Total
              </Badge>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30 dark:bg-slate-900/30 hover:bg-transparent">
                <TableHead className="font-bold py-4">Title</TableHead>
                <TableHead className="font-bold">Author</TableHead>
                <TableHead className="font-bold">Published Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data && data.data.length > 0 ? (
                data.data.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-medium py-4">
                       <div className="flex flex-col">
                          <span className="text-slate-900 dark:text-white line-clamp-1">{blog.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">/{blog.slug}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 overflow-hidden">
                           {blog.author.profile?.avatar ? (
                             <Image src={blog.author.profile.avatar} alt="" className="size-full object-cover" width={24} height={24} />
                           ) : blog.author.name.charAt(0)}
                        </div>
                        <span className="text-sm">{blog.author.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {format(new Date(blog.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                       {blog.isPublished ? (
                         <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">
                            <CheckCircle2 className="size-3 mr-1" /> Published
                         </Badge>
                       ) : (
                         <Badge variant="outline" className="text-slate-400 italic">
                            Draft
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
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${blog.slug}`} target="_blank" className="cursor-pointer">
                              <ExternalLink className="mr-2 h-4 w-4" /> View Public
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/dashboard/blogs-management/edit/${blog.id}`} className="cursor-pointer text-blue-600 dark:text-blue-400">
                              <Edit2 className="mr-2 h-4 w-4" /> Edit Post
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(blog.id, blog.title)}
                            className="text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                       <Search className="size-8 mb-2 opacity-20" />
                       <p>No blog posts found. Create your first one!</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
