"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { reviewsStorage, submissionsStorage } from '@/lib/storage/localStorage';
import { Save, X } from 'lucide-react';
import type { Review, ReviewRecommendation } from '@/lib/types/ojs';

export default function CompleteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [recommendation, setRecommendation] = useState<ReviewRecommendation>('accept');
  const [comments, setComments] = useState('');
  const [commentsForAuthor, setCommentsForAuthor] = useState('');
  const [commentsForEditor, setCommentsForEditor] = useState('');
  const [rating, setRating] = useState(3);

  useEffect(() => {
    setMounted(true);
    const id = params.id as string;
    const reviewData = reviewsStorage.getById(id);
    if (reviewData) {
      setReview(reviewData);
      setComments(reviewData.comments || '');
      setCommentsForAuthor(reviewData.commentsForAuthor || '');
      setCommentsForEditor(reviewData.commentsForEditor || '');
      if (reviewData.recommendation) {
        setRecommendation(reviewData.recommendation);
      }
      if (reviewData.rating) {
        setRating(reviewData.rating);
      }
    }
  }, [params.id]);

  if (!mounted || !review) {
    return null;
  }

  const submission = submissionsStorage.getById(review.submissionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    reviewsStorage.update(review.id, {
      recommendation,
      comments,
      commentsForAuthor,
      commentsForEditor,
      rating,
      completedDate: new Date().toISOString(),
    });

    router.push('/reviews');
  };

  const handleDecline = () => {
    reviewsStorage.update(review.id, {
      declined: true,
    });
    router.push('/reviews');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="Complete Review" 
          description={`Review for: ${submission?.title || 'Submission'}`}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Submission Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Submission Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {submission && (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Title</p>
                        <p className="text-sm text-muted-foreground">{submission.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Abstract</p>
                        <p className="text-sm text-muted-foreground">{submission.abstract}</p>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-medium">Due Date:</span>
                        <span className="text-muted-foreground">
                          {new Date(review.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendation *</CardTitle>
                  <CardDescription>
                    Select your recommendation for this manuscript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={recommendation} onValueChange={(v) => setRecommendation(v as ReviewRecommendation)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="accept" id="accept" />
                      <Label htmlFor="accept" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Accept</p>
                          <p className="text-sm text-muted-foreground">
                            Recommend acceptance without revisions
                          </p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="revisions" id="revisions" />
                      <Label htmlFor="revisions" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Minor Revisions</p>
                          <p className="text-sm text-muted-foreground">
                            Accept with minor revisions required
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="resubmit" id="resubmit" />
                      <Label htmlFor="resubmit" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Major Revisions</p>
                          <p className="text-sm text-muted-foreground">
                            Requires substantial revisions and resubmission
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="decline" id="decline" />
                      <Label htmlFor="decline" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Reject</p>
                          <p className="text-sm text-muted-foreground">
                            Recommend rejection of the manuscript
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Rating */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Rating</CardTitle>
                  <CardDescription>
                    Rate the overall quality of this manuscript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={rating === value ? 'default' : 'outline'}
                        onClick={() => setRating(value)}
                        className="flex-1"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    1 = Poor, 5 = Excellent
                  </p>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Comments</CardTitle>
                  <CardDescription>
                    Provide detailed feedback on the manuscript
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comments">General Comments *</Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter your general review comments..."
                      rows={6}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      These comments will be shared with the editor
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commentsForAuthor">Comments for Author</Label>
                    <Textarea
                      id="commentsForAuthor"
                      value={commentsForAuthor}
                      onChange={(e) => setCommentsForAuthor(e.target.value)}
                      placeholder="Enter comments for the author..."
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      These comments will be shared with the author
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commentsForEditor">Confidential Comments for Editor</Label>
                    <Textarea
                      id="commentsForEditor"
                      value={commentsForEditor}
                      onChange={(e) => setCommentsForEditor(e.target.value)}
                      placeholder="Enter confidential comments for the editor..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      These comments will only be visible to the editor
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDecline}
                >
                  <X className="mr-2 h-4 w-4" />
                  Decline Review
                </Button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/reviews')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
