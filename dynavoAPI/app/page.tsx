'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Database, Key, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] z-0" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div 
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Generate Dynamic APIs <br className="hidden sm:inline" />
                Without Writing Backend Code
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Define your schema. Connect your database. Get an instant API.
              </p>
            </motion.div>
            
            <motion.div 
              className="space-x-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="h-12 px-8 inline-flex items-center transition-all">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                <Link href="/docs">
                  Documentation
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to create and manage your API endpoints
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Schema Builder</h3>
              <p className="text-muted-foreground">
                Create dynamic data models with our intuitive schema builder. Add fields, define types, and set validation rules.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant API</h3>
              <p className="text-muted-foreground">
                Get RESTful API endpoints instantly. No backend coding required. Full CRUD operations available right out of the box.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Built-in authentication and authorization. Control who can access your API with JWT tokens and role-based permissions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Build Your API?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Get started in minutes with our no-code solution.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button asChild size="lg" className="h-12 px-8">
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}