"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

function EventSkeleton() {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="relative overflow-hidden rounded-full h-9 w-9 bg-muted">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.2s_infinite]"></div>
      </div>
      <div className="flex-1 space-y-2 py-1">
        <div className="relative overflow-hidden h-4 rounded w-32 bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.2s_infinite]"></div>
        </div>
        <div className="relative overflow-hidden h-3 rounded w-48 bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.2s_infinite]"></div>
        </div>
        <div className="relative overflow-hidden h-3 rounded w-24 bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.2s_infinite]"></div>
        </div>
        <div className="relative overflow-hidden h-3 rounded w-40 bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RecentSalesStatistic() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://apimycampus.odyzia.com/api/upcoming-events")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEvents(data.evenements);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    // Affiche 3 skeletons pendant le chargement
    return (
      <div className="space-y-8">
        <EventSkeleton />
        <EventSkeleton />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-muted-foreground">Aucun événement à venir.</div>
    );
  }

  return (
    <div className="space-y-8">
      {events.map((event) => (
        <div
          className="flex items-center rounded-xl border shadow-sm bg-white p-4"
          key={event.id}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/event.png" alt="Avatar" />
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{event.nom}</p>
            <p className="text-xs text-muted-foreground">{event.description}</p>
            <p className="text-xs text-muted-foreground">📍 {event.lieu}</p>
            <p className="text-xs text-muted-foreground">
              🕒 {formatDate(event.date_debut)} — {formatDate(event.date_fin)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
