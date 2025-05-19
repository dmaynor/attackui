"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  ScanLine,
  ShieldAlert,
  Bomb,
  KeyRound,
  Flag,
  Brain,
  Terminal,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/reconnaissance', label: 'Reconnaissance', icon: ScanLine },
  { href: '/vulnerability-assessment', label: 'Vulnerability Assessment', icon: ShieldAlert },
  { href: '/exploitation', label: 'Exploitation', icon: Bomb },
  { href: '/privilege-escalation', label: 'Privilege Escalation', icon: KeyRound },
  { href: '/flag-recognition', label: 'Flag Recognition', icon: Flag },
  { href: '/learning', label: 'Learning Center', icon: Brain },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="border-r border-border/70 bg-sidebar text-sidebar-foreground"
        >
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Terminal className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                CTF Solver
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-grow p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className={cn(
                      "justify-start w-full",
                      pathname === item.href
                        ? "bg-primary/20 text-primary hover:bg-primary/30 font-medium"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  className={cn(
                      "justify-start w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground",
                      pathname === '/settings' && "bg-primary/20 text-primary hover:bg-primary/30 font-medium"
                  )}
                >
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <div className="md:hidden">
              <SidebarTrigger className="text-foreground hover:text-primary" />
            </div>
            <div className="flex-1 md:hidden" /> {/* Spacer for mobile */}
            <div className="hidden md:block" /> {/* Spacer for desktop */}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">CTF User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@ctf.local
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
