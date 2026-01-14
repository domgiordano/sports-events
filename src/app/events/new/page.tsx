import { getUser } from "@/actions/auth";
import { Header } from "@/components/header";
import { EventForm } from "@/components/event-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewEventPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <Header user={user} />

      <main className="relative container py-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-black tracking-tight">CREATE EVENT</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new sports event.
          </p>
        </div>

        <EventForm />
      </main>
    </div>
  );
}
