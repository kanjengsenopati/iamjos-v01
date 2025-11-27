"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { queries, authStorage, submissionsStorage, usersStorage } from '@/lib/storage/localStorage';
import { Clock, CheckCircle2, XCircle, Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Review } from '@/lib/types/ojs';

export default function ReviewsPage() {
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const currentUser = authStorage.getCurrentUser();
    if (currentUser && currentUser.roles.includes('reviewer')) {
      const userReviews = queries.getReviewsByReviewer(currentUser.id);
      setReviews(userReviews);
      setPendingCount(userReviews.filter(r => !r.completedDate && !r.declined).length);
      setCompletedCount(userReviews.filter(r => r.completedDate).length);
    } else if (currentUser && (currentUser.roles.includes('editor') || currentUser.roles.includes('admin'))) {
      // For editors/admins, show all reviews
      const allReviews = queries.getReviewsForSubmission('submission-1'); // Demo: show reviews for first submission
      setReviews(allReviews);
      setPendingCount(allReviews.filter(r => !r.completedDate && !r.declined).length);
      setCompletedCount(allReviews.filter(r => r.completedDate).length);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const getStatusBadge = (review: Review) => {
    if (review.declined) {
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Declined</Badge>;
    }
    if (review.completedDate) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-800"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
  };

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="Reviews" 
          description="Manage peer review assignments"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission</TableHead>
                      <TableHead>Round</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No reviews assigned
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((review) => {
                        const submission = submissionsStorage.getById(review.submissionId);
                        const daysRemaining = getDaysRemaining(review.dueDate);
                        
                        return (
                          <TableRow key={review.id}>
                            <TableCell className="font-medium">
                              {submission ? (
                                <Link href={`/submissions/${submission.id}`} className="hover:underline">
                                  {submission.title}
                                </Link>
                              ) : (
                                'Unknown'
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Round {review.reviewRound}</Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(review)}</TableCell>
                            <TableCell>
                              {new Date(review.assignedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(review.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span className={daysRemaining < 0 ? 'text-red-600 font-medium' : daysRemaining < 7 ? 'text-orange-600 font-medium' : ''}>
                                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/reviews/${review.id}`}>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                {!review.completedDate && !review.declined && (
                                  <Link href={`/reviews/${review.id}/complete`}>
                                    <Button size="sm">Complete Review</Button>
                                  </Link>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
