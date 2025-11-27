"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  initializeSeedData,
  queries,
  submissionsStorage,
  journalsStorage,
  authStorage,
} from '@/lib/storage/localStorage';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  Plus,
  Database,
  Loader2,
  ArrowRight,
  Calendar,
  User,
  MessageSquare,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import type { Submission, WorkflowStage } from '@/lib/types/ojs';
import { toast } from 'sonner';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    inReview: 0,
    inEditing: 0,
    published: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
    
    // Get current journal (first journal for demo)
    const journals = journalsStorage.getAll();
    if (journals.length > 0) {
      const journalId = journals[0].id;
      const dashboardStats = queries.getDashboardStats(journalId);
      setStats(dashboardStats);
      
      // Get recent submissions
      const submissions = queries.getSubmissionsByJournal(journalId);
      setRecentSubmissions(submissions.slice(0, 8));
    }
  }, []);

  const handleInitializeDemoData = async () => {
    setIsInitializing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      initializeSeedData();
      
      toast.success('Demo data initialized successfully!', {
        description: 'Your journal system is ready with sample data.',
        duration: 3000,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Failed to initialize demo data', {
        description: 'Please try again or contact support.',
      });
      setIsInitializing(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const currentUser = authStorage.getCurrentUser();
  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-lg shadow-lg border-border/50">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Database className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Welcome to OJS 3.3</CardTitle>
            <CardDescription className="text-base">
              Open Journal Systems - Editorial Management Platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="font-semibold text-sm mb-3 text-foreground">Demo Environment Includes:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Complete journal configuration with metadata
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Multiple user roles (authors, reviewers, editors, admins)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Manuscript submissions in all workflow stages
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Active peer review assignments and decisions
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Published issues with articles and DOI metadata
                </li>
              </ul>
            </div>
            
            <div className="grid gap-3">
              <Button 
                className="w-full h-11 text-base font-medium shadow-sm" 
                onClick={handleInitializeDemoData}
                disabled={isInitializing}
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Initializing Demo Environment...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Initialize Demo Data & Auto-Login
                  </>
                )}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button 
                  variant="outline"
                  className="w-full h-11 text-base font-medium shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors" 
                  disabled={isInitializing}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In with Sample Account
                </Button>
              </Link>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              This creates a local demonstration environment with sample editorial data
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: FileText,
      color: 'text-info',
      bgColor: 'bg-info/10',
      trend: '+12% from last month',
    },
    {
      title: 'In Review',
      value: stats.inReview,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: '5 awaiting assignment',
    },
    {
      title: 'In Editing',
      value: stats.inEditing,
      icon: AlertCircle,
      color: 'text-info',
      bgColor: 'bg-info/10',
      trend: '3 in copyediting',
    },
    {
      title: 'Published',
      value: stats.published,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '2 this month',
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'review':
        return 'secondary';
      case 'declined':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStageBadgeColor = (stage: WorkflowStage) => {
    switch (stage) {
      case 'submission':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'review':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'copyediting':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'production':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="Editorial Dashboard" 
          description={`Welcome back, ${currentUser.firstName} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
          actions={
            <Link href="/submissions/new">
              <Button size="sm" className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                New Submission
              </Button>
            </Link>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Grid - OJS Style */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Submissions - OJS Style */}
            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Active Submissions</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Recent manuscripts in the editorial workflow
                    </CardDescription>
                  </div>
                  <Link href="/submissions">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {recentSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No submissions yet</p>
                    </div>
                  ) : (
                    recentSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="p-4 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/submissions/${submission.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {submission.title}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {submission.abstract}
                            </p>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                              <Badge className={`${getStageBadgeColor(submission.stage)} border-0 font-medium text-xs`}>
                                {submission.stage}
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(submission.status)} className="text-xs">
                                {submission.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(submission.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {submission.authorId}
                              </span>
                            </div>
                          </div>
                          <Link href={`/submissions/${submission.id}`}>
                            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - OJS Style */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-xs mt-1">Common editorial tasks</CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <Link href="/submissions/new" className="block">
                  <Button variant="outline" className="w-full justify-start h-10 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    New Submission
                  </Button>
                </Link>
                <Link href="/submissions" className="block">
                  <Button variant="outline" className="w-full justify-start h-10 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <FileText className="mr-2 h-4 w-4" />
                    All Submissions
                  </Button>
                </Link>
                <Link href="/reviews" className="block">
                  <Button variant="outline" className="w-full justify-start h-10 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Clock className="mr-2 h-4 w-4" />
                    Pending Reviews
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">5</Badge>
                  </Button>
                </Link>
                <Link href="/users" className="block">
                  <Button variant="outline" className="w-full justify-start h-10 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/issues" className="block">
                  <Button variant="outline" className="w-full justify-start h-10 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Publish Issue
                  </Button>
                </Link>
              </CardContent>
              
              {/* Activity Summary */}
              <CardHeader className="border-t border-border/50 bg-muted/30 pb-3 pt-3">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">Review completed</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">New submission</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">Discussion reply</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Overview - OJS Style */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/30">
              <CardTitle className="text-lg">Submission Workflow</CardTitle>
              <CardDescription className="text-xs mt-1">
                Track manuscripts through the editorial process
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="submission" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-11">
                  <TabsTrigger value="submission" className="text-xs">Submission</TabsTrigger>
                  <TabsTrigger value="review" className="text-xs">Review</TabsTrigger>
                  <TabsTrigger value="copyediting" className="text-xs">Copyediting</TabsTrigger>
                  <TabsTrigger value="production" className="text-xs">Production</TabsTrigger>
                  <TabsTrigger value="published" className="text-xs">Published</TabsTrigger>
                </TabsList>
                
                {(['submission', 'review', 'copyediting', 'production', 'published'] as WorkflowStage[]).map((stage) => (
                  <TabsContent key={stage} value={stage} className="mt-4">
                    <div className="space-y-3">
                      {recentSubmissions
                        .filter((s) => s.stage === stage)
                        .map((submission) => (
                          <div
                            key={submission.id}
                            className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground line-clamp-1">{submission.title}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(submission.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <Badge variant={getStatusBadgeVariant(submission.status)} className="text-xs">
                                  {submission.status}
                                </Badge>
                              </div>
                            </div>
                            <Link href={`/submissions/${submission.id}`}>
                              <Button size="sm" className="ml-4">
                                View
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        ))}
                      {recentSubmissions.filter((s) => s.stage === stage).length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">No submissions in {stage} stage</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}