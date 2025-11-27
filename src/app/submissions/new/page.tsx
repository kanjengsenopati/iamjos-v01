"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { submissionsStorage, journalsStorage, authStorage, sectionsStorage } from '@/lib/storage/localStorage';
import { X, Plus, Upload } from 'lucide-react';
import type { Submission, Contributor } from '@/lib/types/ojs';

export default function NewSubmissionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [sectionId, setSectionId] = useState('');
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const currentUser = authStorage.getCurrentUser();
  const journals = journalsStorage.getAll();
  const sections = journals.length > 0 ? sectionsStorage.getByField('journalId', journals[0].id) : [];

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleAddContributor = () => {
    const newContributor: Contributor = {
      id: `contrib-${Date.now()}`,
      firstName: '',
      lastName: '',
      email: '',
      role: 'author',
      isPrimary: contributors.length === 0,
      sequence: contributors.length + 1,
    };
    setContributors([...contributors, newContributor]);
  };

  const handleUpdateContributor = (id: string, field: keyof Contributor, value: any) => {
    setContributors(
      contributors.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  const handleRemoveContributor = (id: string) => {
    setContributors(contributors.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || journals.length === 0) return;

    const newSubmission: Submission = {
      id: `submission-${Date.now()}`,
      journalId: journals[0].id,
      authorId: currentUser.id,
      title,
      subtitle,
      abstract,
      keywords,
      language,
      stage: 'submission',
      status: 'queued',
      submittedDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      sectionId: sectionId || undefined,
      reviewRound: 0,
      files: [],
      metadata: {
        contributors,
      },
    };

    submissionsStorage.create(newSubmission);
    router.push('/submissions');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="New Submission" 
          description="Submit a new manuscript to the journal"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Manuscript Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Manuscript Details</CardTitle>
                  <CardDescription>
                    Provide basic information about your manuscript
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter manuscript title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Enter subtitle (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abstract">Abstract *</Label>
                    <Textarea
                      id="abstract"
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      placeholder="Enter abstract"
                      rows={6}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      {abstract.length} characters
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select value={sectionId} onValueChange={setSectionId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                        placeholder="Enter keyword and press Enter"
                      />
                      <Button type="button" onClick={handleAddKeyword}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contributors */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Contributors</CardTitle>
                      <CardDescription>
                        Add authors and other contributors
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={handleAddContributor} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Contributor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contributors.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No contributors added yet
                    </p>
                  ) : (
                    contributors.map((contributor, index) => (
                      <div key={contributor.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Contributor {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveContributor(contributor.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>First Name *</Label>
                            <Input
                              value={contributor.firstName}
                              onChange={(e) =>
                                handleUpdateContributor(contributor.id, 'firstName', e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name *</Label>
                            <Input
                              value={contributor.lastName}
                              onChange={(e) =>
                                handleUpdateContributor(contributor.id, 'lastName', e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={contributor.email}
                            onChange={(e) =>
                              handleUpdateContributor(contributor.id, 'email', e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Affiliation</Label>
                            <Input
                              value={contributor.affiliation || ''}
                              onChange={(e) =>
                                handleUpdateContributor(contributor.id, 'affiliation', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                              value={contributor.country || ''}
                              onChange={(e) =>
                                handleUpdateContributor(contributor.id, 'country', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>
                    Upload manuscript files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button type="button" variant="outline" className="mt-4">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/submissions')}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Manuscript
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
