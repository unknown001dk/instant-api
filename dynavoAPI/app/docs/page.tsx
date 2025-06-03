'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, useProjects } from '@/lib/projects';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

export default function DocsPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { projects, getProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      const project = getProject(projectId);
      if (project) {
        setSelectedProject(project);
      }
    } else if (projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projectId, projects, getProject]);

  const getExampleJson = (project: Project | null) => {
    if (!project) return '{}';
    
    const example: Record<string, any> = {};
    project.schema.forEach(field => {
      let value: any;
      switch (field.type) {
        case 'string':
          value = field.name === 'email' ? 'user@example.com' : 
                  field.name === 'name' ? 'John Doe' :
                  field.name === 'username' ? 'johndoe' : 'Example text';
          break;
        case 'number':
          value = field.name.includes('id') ? 1 : 
                  field.name.includes('age') ? 25 : 42;
          break;
        case 'boolean':
          value = true;
          break;
        case 'date':
          value = new Date().toISOString();
          break;
        case 'object':
          value = { example: 'value' };
          break;
        case 'array':
          value = ['example'];
          break;
        default:
          value = null;
      }
      example[field.name] = value;
    });
    
    return JSON.stringify(example, null, 2);
  };

  const baseApiUrl = selectedProject?.apiUrl || 'https://api.dynavoapiurl.com/example';

  return (
    <div className="container py-10 px-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Learn how to use your generated API endpoints
          </p>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No projects found</CardTitle>
              <CardDescription>
                Create a project to generate an API and view its documentation
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5 w-full md:w-[600px] mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="get">GET</TabsTrigger>
              <TabsTrigger value="post">POST</TabsTrigger>
              <TabsTrigger value="put">PUT</TabsTrigger>
              <TabsTrigger value="delete">DELETE</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>API Overview</CardTitle>
                    <CardDescription>
                      Basic information about your API and how to use it
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Base URL</h3>
                      <code className="bg-muted p-2 rounded text-sm block">{baseApiUrl}</code>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        All API requests require authentication using an API key in the header:
                      </p>
                      <code className="bg-muted p-2 rounded text-sm block">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Response Format</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        All responses are returned in JSON format. Successful responses have the following structure:
                      </p>
                      <pre className="bg-muted p-2 rounded text-sm block overflow-auto max-h-[200px]">
                        {`{
  "success": true,
  "data": { ... }
}`}
                      </pre>
                      
                      <p className="text-sm text-muted-foreground my-2">
                        Error responses have the following structure:
                      </p>
                      <pre className="bg-muted p-2 rounded text-sm block overflow-auto max-h-[200px]">
                        {`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoints</CardTitle>
                    <CardDescription>
                      Available API endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible defaultValue="item-1">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900">GET</Badge>
                            <span>/items</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Get all items with optional pagination and filtering
                          </p>
                          <div className="text-sm mt-2">
                            <span className="font-semibold">Example:</span>
                            <code className="bg-muted p-1 rounded ml-2">{baseApiUrl}/items?limit=10&page=1</code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900">GET</Badge>
                            <span>/items/:id</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Get a single item by its ID
                          </p>
                          <div className="text-sm mt-2">
                            <span className="font-semibold">Example:</span>
                            <code className="bg-muted p-1 rounded ml-2">{baseApiUrl}/items/123</code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">POST</Badge>
                            <span>/items</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Create a new item
                          </p>
                          <div className="text-sm mt-2">
                            <span className="font-semibold">Example URL:</span>
                            <code className="bg-muted p-1 rounded ml-2">{baseApiUrl}/items</code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">PUT</Badge>
                            <span>/items/:id</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Update an existing item
                          </p>
                          <div className="text-sm mt-2">
                            <span className="font-semibold">Example URL:</span>
                            <code className="bg-muted p-1 rounded ml-2">{baseApiUrl}/items/123</code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-red-100 dark:bg-red-900">DELETE</Badge>
                            <span>/items/:id</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Delete an item by its ID
                          </p>
                          <div className="text-sm mt-2">
                            <span className="font-semibold">Example URL:</span>
                            <code className="bg-muted p-1 rounded ml-2">{baseApiUrl}/items/123</code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Schema</CardTitle>
                    <CardDescription>
                      Data structure for your API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedProject && selectedProject.schema.length > 0 ? (
                      <div className="border rounded-md">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted font-medium">
                          <div className="col-span-4">Field</div>
                          <div className="col-span-4">Type</div>
                          <div className="col-span-4">Required</div>
                        </div>
                        {selectedProject.schema.map((field) => (
                          <div key={field.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0">
                            <div className="col-span-4 font-medium">{field.name}</div>
                            <div className="col-span-4">
                              <Badge variant="outline">{field.type}</Badge>
                            </div>
                            <div className="col-span-4">
                              {field.required ? (
                                <Badge>Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No schema fields defined for this project
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="get">
              <Card>
                <CardHeader>
                  <CardTitle>GET Requests</CardTitle>
                  <CardDescription>
                    Retrieve resources from your API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Get All Items</h3>
                    <p className="text-sm text-muted-foreground">
                      Retrieve a list of all items with optional pagination and filtering
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">GET {baseApiUrl}/items</code>
                      
                      <p className="font-semibold mb-1 mt-3">Query Parameters</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>limit</code> - Number of items per page (default: 20)</li>
                        <li><code>page</code> - Page number (default: 1)</li>
                        <li><code>sort</code> - Field to sort by (e.g., createdAt)</li>
                        <li><code>order</code> - Sort order (asc or desc)</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "items": [
      ${getExampleJson(selectedProject)}
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Get Item by ID</h3>
                    <p className="text-sm text-muted-foreground">
                      Retrieve a specific item by its unique identifier
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">GET {baseApiUrl}/items/:id</code>
                      
                      <p className="font-semibold mb-1 mt-3">Path Parameters</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>id</code> - The unique identifier of the item</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": ${getExampleJson(selectedProject)}
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="post">
              <Card>
                <CardHeader>
                  <CardTitle>POST Requests</CardTitle>
                  <CardDescription>
                    Create new resources in your API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Create New Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a new item to your collection
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">POST {baseApiUrl}/items</code>
                      
                      <p className="font-semibold mb-1 mt-3">Headers</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>Content-Type</code> - application/json</li>
                        <li><code>Authorization</code> - Bearer YOUR_API_KEY</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Request Body</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
                        {getExampleJson(selectedProject)}
                      </pre>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    ${getExampleJson(selectedProject).slice(1, -1)},
    "createdAt": "${new Date().toISOString()}"
  }
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Create Multiple Items</h3>
                    <p className="text-sm text-muted-foreground">
                      Add multiple items in a single request
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">POST {baseApiUrl}/items/batch</code>
                      
                      <p className="font-semibold mb-1 mt-3">Headers</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>Content-Type</code> - application/json</li>
                        <li><code>Authorization</code> - Bearer YOUR_API_KEY</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Request Body</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "items": [
    ${getExampleJson(selectedProject)},
    ${getExampleJson(selectedProject)}
  ]
}`}
                      </pre>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "inserted": 2,
    "items": [
      {
        "id": "60d21b4667d0d8992e610c85",
        ${getExampleJson(selectedProject).slice(1, -1)},
        "createdAt": "${new Date().toISOString()}"
      },
      {
        "id": "60d21b4667d0d8992e610c86",
        ${getExampleJson(selectedProject).slice(1, -1)},
        "createdAt": "${new Date().toISOString()}"
      }
    ]
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="put">
              <Card>
                <CardHeader>
                  <CardTitle>PUT Requests</CardTitle>
                  <CardDescription>
                    Update existing resources in your API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Update Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Update an existing item by its ID
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">PUT {baseApiUrl}/items/:id</code>
                      
                      <p className="font-semibold mb-1 mt-3">Path Parameters</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>id</code> - The unique identifier of the item</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Headers</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>Content-Type</code> - application/json</li>
                        <li><code>Authorization</code> - Bearer YOUR_API_KEY</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Request Body</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
                        {getExampleJson(selectedProject)}
                      </pre>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    ${getExampleJson(selectedProject).slice(1, -1)},
    "updatedAt": "${new Date().toISOString()}"
  }
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Partial Update (PATCH)</h3>
                    <p className="text-sm text-muted-foreground">
                      Update only specific fields of an item
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">PATCH {baseApiUrl}/items/:id</code>
                      
                      <p className="font-semibold mb-1 mt-3">Path Parameters</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>id</code> - The unique identifier of the item</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Headers</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>Content-Type</code> - application/json</li>
                        <li><code>Authorization</code> - Bearer YOUR_API_KEY</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Request Body</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "${selectedProject?.schema[0]?.name || 'title'}": "Updated value"
}`}
                      </pre>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    ${getExampleJson(selectedProject).slice(1, -1)},
    "updatedAt": "${new Date().toISOString()}"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delete">
              <Card>
                <CardHeader>
                  <CardTitle>DELETE Requests</CardTitle>
                  <CardDescription>
                    Remove resources from your API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Delete Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Delete an item by its ID
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">DELETE {baseApiUrl}/items/:id</code>
                      
                      <p className="font-semibold mb-1 mt-3">Path Parameters</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>id</code> - The unique identifier of the item</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Headers</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>Authorization</code> - Bearer YOUR_API_KEY</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "deleted": true,
    "id": "60d21b4667d0d8992e610c85"
  }
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Bulk Delete</h3>
                    <p className="text-sm text-muted-foreground">
                      Delete multiple items in a single request
                    </p>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-semibold mb-1">Request</p>
                      <code className="block mb-2">DELETE {baseApiUrl}/items</code>
                      
                      <p className="font-semibold mb-1 mt-3">Headers</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><code>Content-Type</code> - application/json</li>
                        <li><code>Authorization</code> - Bearer YOUR_API_KEY</li>
                      </ul>
                      
                      <p className="font-semibold mb-1 mt-3">Request Body</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "ids": [
    "60d21b4667d0d8992e610c85",
    "60d21b4667d0d8992e610c86"
  ]
}`}
                      </pre>
                      
                      <p className="font-semibold mb-1 mt-3">Response</p>
                      <pre className="text-sm overflow-auto max-h-[300px]">
{`{
  "success": true,
  "data": {
    "deleted": 2,
    "ids": [
      "60d21b4667d0d8992e610c85",
      "60d21b4667d0d8992e610c86"
    ]
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </div>
  );
}