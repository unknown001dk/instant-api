"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Hobby",
    price: "Free",
    description: "Perfect for side projects and experiments",
    features: [
      "Up to 3 API projects",
      "100 requests/day",
      "Basic rate limiting",
      "Community support",
      "Basic documentation",
    ],
  },
  {
    name: "Basic",
    price: "199",
    description: "For professional developers and small teams",
    features: [
      "Unlimited API projects",
      "1,000 requests/day",
      "Advanced rate limiting",
      "Priority support",
      "Custom documentation",
      "Team collaboration",
      "Custom domains",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: "499",
    description: "For professional developers and small teams",
    features: [
      "Unlimited API projects",
      "10,000 requests/day",
      "Advanced rate limiting",
      "Priority support",
      "Custom documentation",
      "Team collaboration",
      "Custom domains",
    ],
    popular: false,
  },
  // {
  //   name: "Enterprise",
  //   price: "Custom",
  //   description: "For large teams and organizations",
  //   features: [
  //     "Unlimited everything",
  //     "Dedicated support",
  //     "SLA guarantee",
  //     "Custom integration",
  //     "Advanced security",
  //     "Team training",
  //     "Audit logs",
  //   ],
  // },
];

export default function PricingPage() {
  return (
    <div className="container py-12 px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your needs. All plans include our core
          features.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={`relative ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/register"}
                  >
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <p className="text-muted-foreground">
          All prices are in IND and exclude applicable taxes. Need a custom
          plan?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
