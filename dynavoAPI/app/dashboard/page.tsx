'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Database, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useProjects } from '@/lib/projects';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects } = useProjects();

  return (
    <div className="container py-10 px-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first project to get started with DynavoAPI.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground max-w-md mb-4">
              Define your schema, connect your database, and get an instant API without writing backend code.
            </p>
            <Button asChild>
              <Link href="/dashboard/new-project">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{project.name}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Schema Fields</p>
                        <p className="font-medium">{project.schema.length}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">API Status</p>
                        <p className="font-medium">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Active
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted p-2 rounded-md border text-xs overflow-hidden">
                      <p className="font-mono truncate">{project.apiUrl}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: projects.length * 0.1 }}
          >
            <Card className="h-full border-dashed cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full py-10">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <PlusCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mb-2">New Project</CardTitle>
                <CardDescription className="text-center">
                  Create a new API project
                </CardDescription>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/dashboard/new-project">
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}