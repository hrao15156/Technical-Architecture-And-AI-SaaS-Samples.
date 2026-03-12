"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Edit, Trash2, Mail, Phone, Star } from "lucide-react"
import ContactForm from "./contact-form"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  job_title: string
  department: string
  company_id: string
  lead_source: string
  notes: string
  ai_score: number
  companies: {
    name: string
  } | null
}

interface Company {
  id: string
  name: string
}

interface ContactsTableProps {
  contacts: Contact[]
  companies: Company[]
}

export default function ContactsTable({ contacts, companies }: ContactsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.companies?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleDelete = async (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        const { error } = await supabase.from("contacts").delete().eq("id", contactId)
        if (error) throw error
        router.refresh()
      } catch (error) {
        console.error("Error deleting contact:", error)
      }
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700"
    if (score >= 60) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>Add Contact</Button>
      </div>

      {/* Contacts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Lead Source</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {getInitials(contact.first_name, contact.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <p className="text-sm text-slate-500">{contact.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-slate-900">{contact.companies?.name || "No Company"}</p>
                </TableCell>
                <TableCell>
                  <p className="text-slate-900">{contact.job_title || "—"}</p>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {contact.email && (
                      <div className="flex items-center space-x-1 text-sm text-slate-600">
                        <Mail className="h-3 w-3" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center space-x-1 text-sm text-slate-600">
                        <Phone className="h-3 w-3" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {contact.lead_source && (
                    <Badge variant="secondary" className="text-xs">
                      {contact.lead_source}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getScoreColor(contact.ai_score)}`}>{contact.ai_score}</Badge>
                    {contact.ai_score >= 80 && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(contact)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Contact Form Dialog */}
      <ContactForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open)
          if (!open) setEditingContact(null)
        }}
        companies={companies}
        contact={editingContact}
      />
    </div>
  )
}
