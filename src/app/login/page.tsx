"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { authStorage, usersStorage } from '@/lib/storage/localStorage';
import { LogIn, User, Mail, Lock, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleAccounts = [
    {
      email: 'admin@journal.com',
      name: 'Admin User',
      role: 'Administrator / Editor',
      description: 'Full system access, manage journal and users',
      badge: 'admin',
      badgeColor: 'bg-primary text-primary-foreground',
    },
    {
      email: 'author@university.edu',
      name: 'John Smith',
      role: 'Author',
      description: 'Submit and manage manuscripts',
      badge: 'author',
      badgeColor: 'bg-info/90 text-info-foreground',
    },
    {
      email: 'reviewer@university.edu',
      name: 'Mary Jones',
      role: 'Reviewer',
      description: 'Review submitted manuscripts',
      badge: 'reviewer',
      badgeColor: 'bg-success text-success-foreground',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email is required', {
        description: 'Please enter your email address',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find user by email
      const users = usersStorage.getAll();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        toast.error('Invalid credentials', {
          description: 'No account found with this email address',
        });
        setIsLoading(false);
        return;
      }

      // Set current user
      authStorage.setCurrentUser(user);

      toast.success('Login successful!', {
        description: `Welcome back, ${user.firstName} ${user.lastName}`,
        duration: 2000,
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/');
      }, 500);

    } catch (error) {
      toast.error('Login failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
      setIsLoading(false);
    }
  };

  const quickLogin = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6">
        {/* Login Form */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-3 pb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <LogIn className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Sign In to OJS 3.3</CardTitle>
              <CardDescription className="text-base mt-2">
                Open Journal Systems - Editorial Management Platform
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-info/30 bg-info/5 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Demo Environment</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is a demonstration system. Click any sample account below to auto-fill the email field.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium shadow-sm" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Lock className="mr-2 h-5 w-5 animate-pulse" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ← Back to Welcome Screen
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sample Accounts */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="border-b border-border/50 bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Sample Test Accounts
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Click any account to quick-fill the login form
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {sampleAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => quickLogin(account.email)}
                disabled={isLoading}
                className="w-full text-left p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {account.name}
                      </h4>
                      <Badge className={`${account.badgeColor} text-xs font-medium`}>
                        {account.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {account.role}
                    </p>
                    <p className="text-xs text-muted-foreground/80 line-clamp-1">
                      {account.description}
                    </p>
                  </div>
                  <LogIn className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <code className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                      {account.email}
                    </code>
                  </div>
                </div>
              </button>
            ))}

            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">Important Note</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is a demo environment using localStorage. Data persists locally in your browser only.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
