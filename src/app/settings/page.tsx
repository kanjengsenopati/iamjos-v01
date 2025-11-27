"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ojs/Sidebar';
import { Header } from '@/components/ojs/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { journalsStorage } from '@/lib/storage/localStorage';
import { Save, Globe, Mail, Shield, Palette } from 'lucide-react';
import type { Journal } from '@/lib/types/ojs';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [journal, setJournal] = useState<Journal | null>(null);

  useEffect(() => {
    setMounted(true);
    const journals = journalsStorage.getAll();
    if (journals.length > 0) {
      setJournal(journals[0]);
    }
  }, []);

  if (!mounted || !journal) {
    return null;
  }

  const handleSave = () => {
    if (journal) {
      journalsStorage.update(journal.id, {
        ...journal,
        updatedAt: new Date().toISOString(),
      });
      alert('Settings saved successfully!');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title="Settings" 
          description="Configure journal settings and preferences"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">
                  <Globe className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="workflow">
                  <Shield className="mr-2 h-4 w-4" />
                  Workflow
                </TabsTrigger>
                <TabsTrigger value="appearance">
                  <Palette className="mr-2 h-4 w-4" />
                  Appearance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Journal Information</CardTitle>
                    <CardDescription>
                      Basic information about your journal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Journal Name</Label>
                      <Input
                        id="name"
                        value={journal.name}
                        onChange={(e) => setJournal({ ...journal, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initials">Initials</Label>
                      <Input
                        id="initials"
                        value={journal.initials}
                        onChange={(e) => setJournal({ ...journal, initials: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={journal.description}
                        onChange={(e) => setJournal({ ...journal, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher</Label>
                      <Input
                        id="publisher"
                        value={journal.publisher}
                        onChange={(e) => setJournal({ ...journal, publisher: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="issn">ISSN</Label>
                        <Input
                          id="issn"
                          value={journal.issn || ''}
                          onChange={(e) => setJournal({ ...journal, issn: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="eissn">E-ISSN</Label>
                        <Input
                          id="eissn"
                          value={journal.eissn || ''}
                          onChange={(e) => setJournal({ ...journal, eissn: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enabled"
                        checked={journal.enabled}
                        onCheckedChange={(checked) => setJournal({ ...journal, enabled: checked })}
                      />
                      <Label htmlFor="enabled">Journal is enabled</Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Configuration</CardTitle>
                    <CardDescription>
                      Configure email notifications and templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Primary Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="journal@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp">SMTP Server</Label>
                      <Input
                        id="smtp"
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-submission" defaultChecked />
                        <Label htmlFor="notify-submission">Notify on new submissions</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-review" defaultChecked />
                        <Label htmlFor="notify-review">Notify reviewers of assignments</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="notify-decision" defaultChecked />
                        <Label htmlFor="notify-decision">Notify authors of decisions</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="workflow" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Settings</CardTitle>
                    <CardDescription>
                      Configure submission and review workflows
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="review-deadline">Default Review Deadline (days)</Label>
                      <Input
                        id="review-deadline"
                        type="number"
                        defaultValue="14"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviewers-required">Minimum Reviewers Required</Label>
                      <Input
                        id="reviewers-required"
                        type="number"
                        defaultValue="2"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-assign" />
                        <Label htmlFor="auto-assign">Auto-assign editors</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="blind-review" defaultChecked />
                        <Label htmlFor="blind-review">Enable double-blind review</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="author-revision" defaultChecked />
                        <Label htmlFor="author-revision">Allow author revisions</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your journal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1">Light</Button>
                        <Button variant="outline" className="flex-1">Dark</Button>
                        <Button variant="outline" className="flex-1">Auto</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input
                        id="logo"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        defaultValue="#000000"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
