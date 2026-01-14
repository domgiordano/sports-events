import { notFound } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/actions/auth";
import { getEventById } from "@/actions/events";
import { Header } from "@/components/header";
import { EventForm } from "@/components/event-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const user = await getUser();
  const { id } = await params;

  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;

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
          <h1 className="text-3xl font-black tracking-tight">EDIT EVENT</h1>
          <p className="text-muted-foreground">
            Update the details of your event below.
          </p>
        </div>

        <EventForm event={event} />
      </main>
    </div>
  );
}
