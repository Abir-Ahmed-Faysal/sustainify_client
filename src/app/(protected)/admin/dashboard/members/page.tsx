import UserManagementTable from "@/components/module/admin/UserManagementTable";
import { Users, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MembersManagementPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Users className="size-6" />
           </div>
           <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Community Members</h1>
              <p className="text-slate-500">Oversee active and suspended accounts. Ensure user compliance with community guidelines.</p>
           </div>
        </div>
      </div>

      {/* Info Notice */}
      <Alert className="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 rounded-2xl">
         <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
         <AlertTitle className="text-blue-800 dark:text-blue-300 font-bold">Admin Status Protocol</AlertTitle>
         <AlertDescription className="text-blue-700/80 dark:text-blue-400/80 text-sm">
            Suspended accounts are restricted from logging in and posting new ideas. 
            Admin account status can only be managed via the server terminal for security purposes.
         </AlertDescription>
      </Alert>

      {/* Main Table Component */}
      <UserManagementTable />

      <div className="h-10" />
    </div>
  );
}
