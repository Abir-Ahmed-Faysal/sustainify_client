"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, Trash2 } from "lucide-react"

interface IUser {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  isDeleted: boolean
  createdAt: string
}

export default function MembersManagementPage() {
  const [members, setMembers] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const response = await getMembers()
        // setMembers(response.data)
        setMembers([]) // Mock data for now
      } catch (err) {
        console.error("Error fetching members:", err)
        setError("Failed to load members")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    // TODO: Call API to toggle user active status
    console.log("Toggle active status for user:", userId)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return
    // TODO: Call API to delete user
    console.log("Deleting user:", userId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Members Management</h1>
        <p className="text-slate-600 mt-2">Manage community members and their access</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && members.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No members found</p>
        </div>
      )}

      {!isLoading && members.length > 0 && (
        <div className="space-y-4">
          {members.map((member) => (
            <Card key={member.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                  <p className="text-sm text-slate-600">{member.email}</p>
                  <p className="text-xs text-slate-500">
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {member.role}
                  </span>
                </div>

                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToggleActive(member.id, !member.isActive)}
                    variant={member.isActive ? "outline" : "default"}
                    size="sm"
                    className="flex-1"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {member.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    onClick={() => handleDelete(member.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
