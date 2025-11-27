"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { WorkflowStages } from '@/components/ojs/WorkflowStages';
import { submissionsStorage, queries, reviewsStorage, decisionsStorage } from '@/lib/storage/localStorage';
import {
  FileText,
  Calendar,
  User,
  Mail,
  Building2,
  Globe,
  Tag,
  Download,
  Edit,
  MessageSquare,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import type { Submission, Review, Decision } from '@/lib/types/ojs';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    setMounted(true);
    const id = params.id as string;
    const sub = submissionsStorage.getById(id);
    if (sub) {
      setSubmission(sub);
      const subReviews = queries.getReviewsForSubmission(id);
      const subDecisions = queries.getDecisionsForSubmission(id);
      setReviews(subReviews);
      setDecisions(subDecisions);
    }
  }, [params.id]);

  if (!mounted || !submission) {
    return null;
  }

  const primaryAuthor = submission.metadata.contributors.find((c) => c.isPrimary);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title={submission.title}
          description={`Submission ID: ${submission.id}`}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Workflow Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress</CardTitle>
                <CardDescription>
                  Current stage: {submission.stage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowStages currentStage={submission.stage} />
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{submission.title}</CardTitle>
                        {submission.subtitle && (
                          <CardDescription className="text-base mt-1">
                            {submission.subtitle}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge>{submission.stage}</Badge>
                        <Badge variant="outline">{submission.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Abstract</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {submission.abstract}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary">
                              <Tag className="mr-1 h-3 w-3" />
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Language</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.language.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contributors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {submission.metadata.contributors.map((contributor) => (
                        <div
                          key={contributor.id}
                          className="flex items-start gap-4 p-4 border rounded-lg"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                            {contributor.firstName[0]}
                            {contributor.lastName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {contributor.firstName} {contributor.lastName}
                              </p>
                              {contributor.isPrimary && (
                                <Badge variant="outline">Primary</Badge>
                              )}
                            </div>
                            <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {contributor.email}
                              </div>
                              {contributor.affiliation && (
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-3 w-3" />
                                  {contributor.affiliation}
                                </div>
                              )}
                              {contributor.country && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-3 w-3" />
                                  {contributor.country}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs for Reviews, History, etc. */}
                <Card>
                  <Tabs defaultValue="reviews" className="w-full">
                    <CardHeader>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        <TabsTrigger value="decisions">Decisions</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    
                    <TabsContent value="reviews">
                      <CardContent>
                        {reviews.length === 0 ? (
                          <p className="text-center py-8 text-muted-foreground">
                            No reviews yet
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {reviews.map((review) => (
                              <div key={review.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">Round {review.reviewRound}</Badge>
                                    {review.completedDate ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Completed
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-orange-100 text-orange-800">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Pending
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Due: {new Date(review.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                                {review.recommendation && (
                                  <p className="text-sm">
                                    <strong>Recommendation:</strong> {review.recommendation}
                                  </p>
                                )}
                                {review.comments && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {review.comments}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </TabsContent>

                    <TabsContent value="decisions">
                      <CardContent>
                        {decisions.length === 0 ? (
                          <p className="text-center py-8 text-muted-foreground">
                            No decisions yet
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {decisions.map((decision) => (
                              <div key={decision.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge>{decision.decision}</Badge>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(decision.dateDecided).toLocaleDateString()}
                                  </p>
                                </div>
                                {decision.comments && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {decision.comments}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </TabsContent>

                    <TabsContent value="activity">
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                              1
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Submission received</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(submission.submittedDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Submitted</p>
                        <p className="text-muted-foreground">
                          {new Date(submission.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Last Modified</p>
                        <p className="text-muted-foreground">
                          {new Date(submission.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Review Round</p>
                        <p className="text-muted-foreground">
                          {submission.reviewRound}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href={`/submissions/${submission.id}/edit`} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Submission
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Files
                    </Button>
                  </CardContent>
                </Card>

                {/* Files */}
                <Card>
                  <CardHeader>
                    <CardTitle>Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submission.files.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No files uploaded
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {submission.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{file.fileName}</span>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
