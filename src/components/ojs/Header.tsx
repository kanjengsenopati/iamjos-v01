"use client";

import { Bell, Search, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search submissions, users..."
              className="w-72 pl-9 h-9 bg-background"
            />
          </div>

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9 hidden md:flex">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start justify-between w-full">
                    <p className="text-sm font-medium">New submission received</p>
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">New</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Machine Learning Approaches for Natural Language Processing in Academic Texts
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start justify-between w-full">
                    <p className="text-sm font-medium">Review completed</p>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">Review</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reviewer #3 has submitted their review for submission #241
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start justify-between w-full">
                    <p className="text-sm font-medium">Revision submitted</p>
                    <Badge variant="outline" className="h-5 px-1.5 text-xs">Update</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Author has submitted revised manuscript for article #238
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Actions */}
          {actions && <div className="flex items-center gap-2 ml-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}