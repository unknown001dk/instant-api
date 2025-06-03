'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SchemaFieldForm } from '@/components/schema-field';
import { toast } from 'sonner';
import { SchemaField, useProjects } from '@/lib/projects';
import { motion } from 'framer-motion';

export interface Schema ({
  name: String,
  userId: String,
  fields: String,
  projectName: String,
  realtimeEnabled: Boolean

})

export default function NewProjectPage() {
  const router = useRouter();
  const { addProject } = useProjects();

  const [projectName, setProjectName] = useState('');
  const [connectionUrl, setConnectionUrl] = useState('');
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addField = () => {
    const newField: SchemaField = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      type: 'string',
      required: false,
    };
    setSchemaFields([...schemaFields, newField]);
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setSchemaFields(
      schemaFields.map((field) => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    setSchemaFields(schemaFields.filter((field) => field.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!projectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    if (!connectionUrl.trim()) {
      toast.error('Connection URL is required');
      return;
    }
    
    if (schemaFields.length === 0) {
      toast.error('At least one schema field is required');
      return;
    }
    
    // Validate each field has a name
    const invalidField = schemaFields.find(field => !field.name.trim());
    if (invalidField) {
      toast.error('All fields must have a name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addProject({
        name: projectName,
        connectionUrl,
        schema: schemaFields,
      });

      // get user id from cookie 

      const createSchema: Schema = {
        name, 
        userId,
        fields,
        projectName,
        realtimeEnabled
      }
      
      toast.success('Project created successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create project');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10 px-10 ">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground mt-1">
          Define your project details and schema to generate your API
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Basic information about your API project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="My Awesome API"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connection-url">MongoDB Connection URL</Label>
                <Input
                  id="connection-url"
                  placeholder="mongodb://username:password@host:port/database"
                  value={connectionUrl}
                  onChange={(e) => setConnectionUrl(e.target.value)}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Your connection details are encrypted and stored securely
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Definition</CardTitle>
              <CardDescription>
                Define the data structure for your API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schemaFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No fields defined yet. Add your first field to get started.
                  </p>
                  <Button type="button" onClick={addField}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Field
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {schemaFields.map((field) => (
                    <SchemaFieldForm
                      key={field.id}
                      field={field}
                      onUpdate={updateField}
                      onRemove={removeField}
                    />
                  ))}
                  <Button type="button" variant="outline" onClick={addField} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Field
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || schemaFields.length === 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}