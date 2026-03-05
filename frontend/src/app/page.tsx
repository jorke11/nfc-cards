"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  QrCode,
  BarChart3,
  Palette,
  Shield,
  Zap,
  Users,
  Link2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const features = [
    {
      icon: Smartphone,
      title: "NFC Support",
      description: "Tap your NFC-enabled card to instantly share your digital profile with anyone.",
    },
    {
      icon: QrCode,
      title: "QR Codes",
      description: "Generate custom QR codes for easy scanning and sharing across all devices.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track views, taps, and engagement with detailed real-time analytics.",
    },
    {
      icon: Palette,
      title: "Full Customization",
      description: "Personalize your profile with custom themes, colors, and layouts.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized for mobile devices with a seamless responsive experience.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with complete control over your data.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Profile",
      description: "Sign up and build your digital profile in minutes with our intuitive editor.",
      icon: Users,
    },
    {
      number: "02",
      title: "Customize",
      description: "Add your social links, contact info, and personalize with themes.",
      icon: Palette,
    },
    {
      number: "03",
      title: "Share",
      description: "Share via NFC tap, QR code, or direct link to instantly connect.",
      icon: Link2,
    },
    {
      number: "04",
      title: "Track",
      description: "Monitor engagement and analytics to grow your network effectively.",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-[40%] -left-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[30%] left-[40%] h-[300px] w-[300px] rounded-full bg-gradient-to-bl from-orange-500/10 via-amber-500/10 to-yellow-500/10 blur-3xl animate-pulse [animation-delay:4s]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Sparkles className="mr-1 h-3 w-3" />
              Next-Gen Digital Networking
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text">
              Your Digital Profile,
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                One Tap Away
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-1000 sm:text-xl">
              Create stunning digital business cards with NFC technology and QR codes.
              Share your contact info, social links, and portfolio instantly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {!isLoading && (
                <>
                  {session ? (
                    <Button asChild size="lg" className="group">
                      <Link href="/dashboard">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild size="lg" className="group">
                        <Link href="/register">
                          Get Started Free
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { label: "Active Users", value: "10K+", icon: Users },
                { label: "Profiles Created", value: "50K+", icon: Zap },
                { label: "Total Taps", value: "1M+", icon: TrendingUp },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-1000 rounded-2xl border bg-card/50 backdrop-blur-sm p-6 text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-2 flex justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
              Powerful features to create, customize, and share your digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className="group transition-all hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700 border-border/50 backdrop-blur-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-blue-500/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get Started in Minutes
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
              Four simple steps to create your digital business card.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent lg:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-2xl font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-background border">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 px-8 py-20 text-center shadow-2xl sm:px-16">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
            <div className="relative">
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90">
                Join thousands of professionals using NFC digital profiles to grow their network.
                Create your first card today, absolutely free.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {!isLoading && !session && (
                  <>
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="bg-white text-purple-600 hover:bg-white/90 group"
                    >
                      <Link href="/register">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </>
                )}
                {session && (
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-white/90 group"
                  >
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Benefits */}
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  "No credit card required",
                  "Free forever plan",
                  "Setup in 5 minutes",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center justify-center gap-2 text-white/90">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NFC Digital Profile Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
