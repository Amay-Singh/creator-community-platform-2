import Link from "next/link";
import { Sparkles, Users, MessageSquare, Palette, Zap, Globe } from "lucide-react";

const stats = [
  { label: "Active Creators", value: "10K+" },
  { label: "Collaborations", value: "5K+" },
  { label: "Countries", value: "80+" },
  { label: "Projects Launched", value: "2K+" },
];

const features = [
  {
    icon: Users,
    title: "Discover Creators",
    description: "Find artists and influencers that match your creative vision with AI-powered recommendations.",
  },
  {
    icon: Sparkles,
    title: "AI Content Studio",
    description: "Generate posts, scripts, portfolios, and more with intelligent content tools tailored to your style.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Chat",
    description: "Communicate instantly with collaborators through messaging, group chats, and video calls.",
  },
  {
    icon: Palette,
    title: "Portfolio Showcase",
    description: "Build stunning portfolios with multimedia support — images, videos, and audio all in one place.",
  },
  {
    icon: Zap,
    title: "Project Management",
    description: "Kanban boards, file sharing, whiteboards, and milestones to keep your collaborations on track.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Break language barriers with auto-translation and connect with creators worldwide.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold gradient-text" aria-label="Colab Home">
            Colab
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Community
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="gradient-primary rounded-xl px-5 py-2 text-sm font-medium text-white shadow-md hover:scale-[1.02] hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-secondary-purple/10 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Connect.</span>{" "}
              <span className="gradient-text">Create.</span>{" "}
              <span className="gradient-text">Collaborate.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              The platform where rising artists and influencers discover each other,
              collaborate on projects, and build their creative careers together.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="gradient-primary inline-flex h-12 items-center rounded-xl px-8 text-base font-semibold text-white shadow-lg hover:scale-[1.05] hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Start Creating
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center rounded-xl border-2 border-border bg-transparent px-8 text-base font-semibold text-foreground hover:bg-muted hover:border-primary/50 transition-all"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="border-y border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold gradient-text sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{" "}
              <span className="gradient-text">create together</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed for the modern creator — from discovery to delivery.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white shadow-md group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-card-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 gradient-primary opacity-90" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to join the community?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Sign up today and start connecting with creators who share your vision.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-lg hover:scale-[1.05] hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-2xl font-bold gradient-text">Colab</p>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Colab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
