'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Book, Code, Database, FileCode, Globe, Lock, PlayCircle, Server, Terminal } from "lucide-react";
import Link from "next/link";

const tutorials = [
  {
    title: "Getting Started with DynavoAPI",
    description: "Learn the basics of creating your first API project",
    icon: <PlayCircle className="h-6 w-6" />,
    category: "Beginner",
    duration: "10 min",
    link: "/tutorials/getting-started"
  },
  {
    title: "Schema Design Best Practices",
    description: "Master the art of designing efficient database schemas",
    icon: <Database className="h-6 w-6" />,
    category: "Intermediate",
    duration: "15 min",
    link: "/tutorials/schema-design"
  },
  {
    title: "Authentication & Security",
    description: "Implement secure authentication in your API",
    icon: <Lock className="h-6 w-6" />,
    category: "Advanced",
    duration: "20 min",
    link: "/tutorials/authentication"
  },
  {
    title: "API Integration Guide",
    description: "Connect your API with frontend applications",
    icon: <Globe className="h-6 w-6" />,
    category: "Intermediate",
    duration: "12 min",
    link: "/tutorials/integration"
  },
  {
    title: "Custom Endpoints",
    description: "Create specialized endpoints for complex operations",
    icon: <Terminal className="h-6 w-6" />,
    category: "Advanced",
    duration: "18 min",
    link: "/tutorials/custom-endpoints"
  },
  {
    title: "Data Validation",
    description: "Implement robust input validation for your API",
    icon: <FileCode className="h-6 w-6" />,
    category: "Intermediate",
    duration: "15 min",
    link: "/tutorials/validation"
  },
  {
    title: "Performance Optimization",
    description: "Optimize your API for speed and efficiency",
    icon: <Server className="h-6 w-6" />,
    category: "Advanced",
    duration: "25 min",
    link: "/tutorials/optimization"
  },
  {
    title: "API Documentation",
    description: "Create comprehensive documentation for your API",
    icon: <Book className="h-6 w-6" />,
    category: "Intermediate",
    duration: "15 min",
    link: "/tutorials/documentation"
  },
  {
    title: "Advanced Querying",
    description: "Master complex database queries and operations",
    icon: <Code className="h-6 w-6" />,
    category: "Advanced",
    duration: "22 min",
    link: "/tutorials/advanced-querying"
  }
];

export default function TutorialsPage() {
  return (
    <div className="container py-12 px-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">Learn DynavoAPI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master the art of API development with our comprehensive tutorials and guides.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={tutorial.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {tutorial.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {tutorial.category}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group">
                    Start Learning
                    <PlayCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold mb-4">Need Custom Training?</h3>
            <p className="text-muted-foreground mb-6">
              We offer personalized training sessions for teams and organizations.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}