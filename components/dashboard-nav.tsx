"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Brain,
  LayoutDashboard,
  Users,
  Building2,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react"
import { signOut } from "@/lib/actions"
import { cn } from "@/lib/utils"

interface DashboardNavProps {
  user: {
    email?: string
    full_name?: string
    avatar_url?: string
    role?: string
  }
}

const getNavigation = (userRole?: string) => {
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Companies", href: "/dashboard/companies", icon: Building2 },
    { name: "Deals", href: "/dashboard/deals", icon: Target },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ]

  // Add User Management for admin users
  if (userRole === "admin") {
    baseNavigation.push({ name: "User Management", href: "/dashboard/users", icon: Shield })
  }

  baseNavigation.push({ name: "Settings", href: "/dashboard/settings", icon: Settings })

  return baseNavigation
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = getNavigation(user.role)

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4 shadow-sm">
          <div className="flex h-16 shrink-0 items-center">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="ml-3 text-xl font-bold text-sidebar-foreground">AI CRM</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                            : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent",
                          "group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200",
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? "text-sidebar-primary-foreground"
                              : "text-muted-foreground group-hover:text-sidebar-primary",
                            "h-5 w-5 shrink-0 transition-colors",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto hover:bg-sidebar-accent rounded-xl transition-colors"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name || user.email} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                          {user.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/users" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          User Management
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={signOut}>
                        <button type="submit" className="flex w-full items-center cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-foreground hover:bg-muted rounded-lg transition-colors lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">AI CRM</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1.5 rounded-full hover:bg-muted">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name || user.email} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              {user.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/users" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    User Management
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOut}>
                  <button type="submit" className="flex w-full items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="relative z-50 lg:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-0 flex">
              <div className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4 shadow-xl">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <span className="ml-3 text-xl font-bold text-sidebar-foreground">AI CRM</span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  pathname === item.href
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                    : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent",
                                  "group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200",
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    pathname === item.href
                                      ? "text-sidebar-primary-foreground"
                                      : "text-muted-foreground group-hover:text-sidebar-primary",
                                    "h-5 w-5 shrink-0 transition-colors",
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
