"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { issuesStorage, journalsStorage } from '@/lib/storage/localStorage';
import { Plus, Eye, Edit, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Issue } from '@/lib/types/ojs';

export default function IssuesPage() {
  const [mounted, setMounted] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setMounted(true);
    const journals = journalsStorage.getAll();
    if (journals.length > 0) {
      const journalIssues = issuesStorage.getByField('journalId', journals[0].id);
      setIssues(journalIssues.sort((a, b) => b.year - a.year));
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="Issues" 
          description="Manage journal issues and publications"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Journal Issues</h2>
              <p className="text-sm text-muted-foreground">
                Organize and publish journal issues
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Issue
            </Button>
          </div>

          {issues.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No issues yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first journal issue to get started
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {issues.map((issue) => (
                <Card key={issue.id} className="overflow-hidden">
                  {issue.coverImageUrl && (
                    <div className="h-48 bg-muted">
                      <img
                        src={issue.coverImageUrl}
                        alt={`Issue ${issue.number}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>
                          Vol. {issue.volume}, No. {issue.number}
                        </CardTitle>
                        <CardDescription>
                          {issue.title || `${issue.year}`}
                        </CardDescription>
                      </div>
                      {issue.published ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {issue.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {issue.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {issue.published && issue.datePublished
                          ? `Published ${new Date(issue.datePublished).toLocaleDateString()}`
                          : `Year ${issue.year}`}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {issue.submissions.length} article{issue.submissions.length !== 1 ? 's' : ''}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
