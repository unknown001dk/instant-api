'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Code, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/items',
    description: 'List all items',
    parameters: [
      { name: 'page', type: 'number', description: 'Page number for pagination' },
      { name: 'limit', type: 'number', description: 'Number of items per page' },
      { name: 'sort', type: 'string', description: 'Field to sort by' },
      { name: 'order', type: 'string', description: 'Sort direction (asc/desc)' }
    ],
    response: {
      success: true,
      data: {
        items: [
          { id: 1, name: 'Example Item', created_at: '2024-03-20T12:00:00Z' }
        ],
        pagination: {
          total: 100,
          page: 1,
          limit: 10
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/items',
    description: 'Create a new item',
    body: {
      name: 'string',
      description: 'string',
      price: 'number'
    },
    response: {
      success: true,
      data: {
        id: 1,
        name: 'New Item',
        created_at: '2024-03-20T12:00:00Z'
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/items/:id',
    description: 'Update an existing item',
    parameters: [
      { name: 'id', type: 'string', description: 'Item ID' }
    ],
    body: {
      name: 'string',
      description: 'string',
      price: 'number'
    },
    response: {
      success: true,
      data: {
        id: 1,
        name: 'Updated Item',
        updated_at: '2024-03-20T12:00:00Z'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/items/:id',
    description: 'Delete an item',
    parameters: [
      { name: 'id', type: 'string', description: 'Item ID' }
    ],
    response: {
      success: true,
      data: {
        message: 'Item deleted successfully'
      }
    }
  }
];

const authentication = {
  type: 'Bearer Token',
  example: 'Authorization: Bearer YOUR_API_KEY',
  description: 'All API endpoints require authentication using a Bearer token in the Authorization header.'
};

const errorCodes = [
  { code: 400, message: 'Bad Request', description: 'The request was malformed or contains invalid parameters.' },
  { code: 401, message: 'Unauthorized', description: 'Authentication failed or token is invalid.' },
  { code: 403, message: 'Forbidden', description: 'The authenticated user doesn\'t have permission to access this resource.' },
  { code: 404, message: 'Not Found', description: 'The requested resource was not found.' },
  { code: 429, message: 'Too Many Requests', description: 'Rate limit exceeded.' },
  { code: 500, message: 'Internal Server Error', description: 'An unexpected error occurred on the server.' }
];

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const methodColors = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  };

  return (
    <div className="container py-12 px-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">API Reference</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete documentation of the DynavoAPI REST endpoints
        </p>
      </motion.div>

      <Tabs defaultValue="endpoints" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredEndpoints.map((endpoint, index) => (
              <motion.div
                key={`${endpoint.method}-${endpoint.path}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className={methodColors[endpoint.method as keyof typeof methodColors]}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(endpoint.path)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {endpoint.parameters && (
                      <div>
                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="bg-muted rounded-lg p-4">
                          {endpoint.parameters.map(param => (
                            <div key={param.name} className="flex items-start space-x-4 mb-2 last:mb-0">
                              <code className="text-sm font-mono min-w-[100px]">{param.name}</code>
                              <span className="text-sm text-muted-foreground flex-1">{param.description}</span>
                              <Badge variant="outline">{param.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.body && (
                      <div>
                        <h4 className="font-semibold mb-2">Request Body</h4>
                        <div className="bg-muted rounded-lg p-4">
                          <pre className="text-sm font-mono">
                            {JSON.stringify(endpoint.body, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Response</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <pre className="text-sm font-mono">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Learn how to authenticate your API requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Authentication Type</h4>
                <p className="text-muted-foreground">{authentication.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example</h4>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                  <code className="text-sm font-mono">{authentication.example}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(authentication.example)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Getting Your API Key</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Log in to your DynavoAPI dashboard</li>
                  <li>Navigate to the API Keys section</li>
                  <li>Click "Generate New Key"</li>
                  <li>Copy your API key and store it securely</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
              <CardDescription>Understanding API error responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {errorCodes.map((error, index) => (
                  <motion.div
                    key={error.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="font-mono">
                        {error.code}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{error.message}</h4>
                      <p className="text-sm text-muted-foreground">{error.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="py-8">
            <div className="flex items-center justify-center mb-4">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Our developer support team is always ready to help you integrate our API.
            </p>
            <Button asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}