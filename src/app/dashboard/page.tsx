import { Suspense } from "react";
import Link from "next/link";
import { getUser } from "@/actions/auth";
import { getEvents, EventsQueryParams } from "@/actions/events";
import { Header } from "@/components/header";
import { EventsFilter } from "@/components/events-filter";
import { EventsList } from "@/components/events-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SportType } from "@/types";
import { Plus } from "lucide-react";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    sport?: string;
  }>;
}

function EventsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

async function EventsContent({ params }: { params: EventsQueryParams }) {
  const result = await getEvents(params);

  if (!result.success) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  return <EventsList events={result.data} />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getUser();
  const resolvedParams = await searchParams;

  const queryParams: EventsQueryParams = {
    search: resolvedParams.search,
    sportType: (resolvedParams.sport as SportType) || "all",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <Header user={user} />

      <main className="relative container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">MY EVENTS</h1>
              <p className="text-muted-foreground">
                Manage and track all your sports events
              </p>
            </div>
            <Button asChild className="hidden sm:flex font-semibold">
              <Link href="/events/new">
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Button>
          </div>

          <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
            <EventsFilter />
          </Suspense>

          <Suspense fallback={<EventsGridSkeleton />}>
            <EventsContent params={queryParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
