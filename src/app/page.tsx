import Link from "next/link";
import { getUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, MapPin, Users, Zap, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
      
      <header className="relative container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-black text-xl tracking-tight">SPORTEVENTS</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild className="font-semibold">
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="relative container">
        <section className="py-24 md:py-36">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              Built for athletes & organizers
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              MANAGE YOUR
              <span className="block text-primary">SPORTS EVENTS</span>
              LIKE A PRO
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create, organize, and track all your sports events in one powerful platform.
              From local pickup games to tournament series.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="text-lg px-8 py-6 font-bold">
                <Link href="/signup">
                  START FREE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 font-semibold">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Scheduling</h3>
              <p className="text-muted-foreground">
                Create events with dates, times, and all the details you need in seconds.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Venues</h3>
              <p className="text-muted-foreground">
                Add multiple venues per event with addresses and capacity tracking.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">All Sports</h3>
              <p className="text-muted-foreground">
                Soccer, basketball, tennis, and 15+ sports supported out of the box.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SportEvents. Built for competition.</p>
        </div>
      </footer>
    </div>
  );
}
