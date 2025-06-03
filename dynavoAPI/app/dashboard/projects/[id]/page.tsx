'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, ExternalLink, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Project, useProjects } from '@/lib/projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { getProject, removeProject } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const foundProject = getProject(projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      toast.error('Project not found');
      router.push('/dashboard');
    }
  }, [projectId, getProject, router]);

  const handleCopyUrl = () => {
    if (project) {
      navigator.clipboard.writeText(project.apiUrl);
      toast.success('API URL copied to clipboard');
    }
  };

  const handleDeleteProject = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      removeProject(projectId);
      toast.success('Project deleted successfully');
      router.push('/dashboard');
    }
  };

  if (!project) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading project...</h2>
          <p className="text-muted-foreground">Please wait while we load your project details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 px-10">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground mt-1">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/docs?project=${projectId}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Docs
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API URL</CardTitle>
            <CardDescription>
              Use this URL to access your API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md flex justify-between items-center">
              <code className="text-sm font-mono break-all">{project.apiUrl}</code>
              <Button variant="ghost" size="sm" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="schema" className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px] mb-4">
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle>Schema Definition</CardTitle>
                <CardDescription>
                  The data structure for your API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.schema.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No schema fields defined</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted font-medium">
                      <div className="col-span-4">Field Name</div>
                      <div className="col-span-4">Type</div>
                      <div className="col-span-4">Required</div>
                    </div>
                    {project.schema.map((field) => (
                      <motion.div 
                        key={field.id}
                        className="grid grid-cols-12 gap-4 p-4 border-b last:border-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="col-span-4 font-medium">{field.name}</div>
                        <div className="col-span-4">
                          <Badge variant="outline">{field.type}</Badge>
                        </div>
                        <div className="col-span-4">
                          {field.required ? (
                            <Badge>Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>
                  Manage your project configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Connection Details</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono break-all">{project.connectionUrl.replace(/(?<=:\/\/[^:]+:)[^@]+(?=@)/, '•••••••••')}</p>
                  </div>
                </div>
                
                <Alert>
                  <AlertDescription>
                    Project settings management is currently in development. Check back soon for more options.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}