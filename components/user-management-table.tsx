"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Check, X, Pause, Play, Shield, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PendingUser {
  id: string
  email: string
  full_name: string
  requested_role: "admin" | "sales_agent"
  status: "pending" | "approved" | "rejected"
  created_at: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: "admin" | "sales_manager" | "sales_rep"
  status: "pending" | "approved" | "rejected" | "suspended"
  created_at: string
}

export function UserManagementTable() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    role: "sales_agent" as "admin" | "sales_agent",
    password: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pendingResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/pending-users"),
        fetch("/api/admin/users"),
      ])

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json()
        setPendingUsers(pendingData)
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setAllUsers(usersData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string, role: "admin" | "sales_agent" = "sales_agent") => {
    try {
      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User approved successfully",
        })
        fetchData()
      } else {
        throw new Error("Failed to approve user")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/reject-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason: rejectionReason }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User rejected successfully",
        })
        setRejectionReason("")
        fetchData()
      } else {
        throw new Error("Failed to reject user")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive",
      })
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User created successfully",
        })
        setNewUser({ email: "", full_name: "", role: "sales_agent", password: "" })
        setShowCreateDialog(false)
        fetchData()
      } else {
        throw new Error("Failed to create user")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (userId: string, status: "approved" | "suspended") => {
    try {
      const response = await fetch("/api/admin/update-user-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${status} successfully`,
        })
        fetchData()
      } else {
        throw new Error("Failed to update user status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user access and permissions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "sales_agent") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales_agent">Sales Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateUser} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "pending" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Pending Approvals ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "all" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          All Users ({allUsers.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "pending" ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending User Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending user requests</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.requested_role === "admin" ? "destructive" : "secondary"}>
                          {user.requested_role === "admin" ? "Admin" : "Sales Agent"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(user.id, user.requested_role)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject User Request</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>Are you sure you want to reject {user.full_name}'s request?</p>
                                <div>
                                  <Label htmlFor="reason">Rejection Reason</Label>
                                  <Textarea
                                    id="reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Please provide a reason for rejection..."
                                  />
                                </div>
                                <Button onClick={() => handleReject(user.id)} variant="destructive" className="w-full">
                                  Reject User
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role === "admin"
                          ? "Admin"
                          : user.role === "sales_manager"
                            ? "Sales Manager"
                            : "Sales Rep"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "approved"
                            ? "default"
                            : user.status === "suspended"
                              ? "destructive"
                              : user.status === "pending"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.status === "approved" ? (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(user.id, "suspended")}>
                          <Pause className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : user.status === "suspended" ? (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
