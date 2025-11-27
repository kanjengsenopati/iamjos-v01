"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Search,
  BarChart3,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authStorage } from '@/lib/storage/localStorage';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Submissions', href: '/submissions', icon: FileText, badge: 12 },
  { name: 'Reviews', href: '/reviews', icon: Search, badge: 5 },
  { name: 'Issues', href: '/issues', icon: BookOpen },
  { name: 'Users & Roles', href: '/users', icon: Users },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Tools & Settings', href: '/settings', icon: Wrench },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const currentUser = authStorage.getCurrentUser();

  const handleLogout = () => {
    authStorage.logout();
    window.location.reload();
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header - OJS Style */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
              OJS
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">Open Journal</span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">System 3.3</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto', 'h-8 w-8')}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info - OJS Style */}
      {currentUser && (
        <div className="border-b border-sidebar-border bg-sidebar-accent/50 p-3">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  {currentUser.firstName[0]}
                  {currentUser.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentUser.roles.map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="text-xs px-1.5 py-0 h-5"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm mx-auto">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
          )}
        </div>
      )}

      {/* Navigation - OJS Style */}
      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant={isActive ? "secondary" : "outline"} className="h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer - OJS Style */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start gap-3 text-sm',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
        {!collapsed && (
          <div className="mt-2 px-3 py-2 text-xs text-muted-foreground">
            <p>OJS 3.3</p>
            <p className="mt-0.5">Powered by PKP</p>
          </div>
        )}
      </div>
    </aside>
  );
}