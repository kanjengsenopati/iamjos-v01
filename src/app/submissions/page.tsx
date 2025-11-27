"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { queries, journalsStorage } from '@/lib/storage/localStorage';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Submission, WorkflowStage, SubmissionStatus } from '@/lib/types/ojs';

export default function SubmissionsPage() {
  const [mounted, setMounted] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
    const journals = journalsStorage.getAll();
    if (journals.length > 0) {
      const allSubmissions = queries.getSubmissionsByJournal(journals[0].id);
      setSubmissions(allSubmissions);
      setFilteredSubmissions(allSubmissions);
    }
  }, []);

  useEffect(() => {
    let filtered = [...submissions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.abstract.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter((s) => s.stage === stageFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, stageFilter, statusFilter, submissions]);

  if (!mounted) {
    return null;
  }

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: WorkflowStage) => {
    switch (stage) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'production':
        return 'bg-purple-100 text-purple-800';
      case 'copyediting':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="Submissions" 
          description="Manage all manuscript submissions"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardContent className="pt-6">
              {/* Filters and Actions */}
              <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="submission">Submission</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="copyediting">Copyediting</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="queued">Queued</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="editing">Editing</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Link href="/submissions/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Submission
                  </Button>
                </Link>
              </div>

              {/* Submissions Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No submissions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/submissions/${submission.id}`}
                              className="hover:underline"
                            >
                              {submission.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {submission.metadata.contributors[0]?.firstName}{' '}
                            {submission.metadata.contributors[0]?.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStageColor(submission.stage)}>
                              {submission.stage}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(submission.submittedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/submissions/${submission.id}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/submissions/${submission.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredSubmissions.length} of {submissions.length} submissions
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
