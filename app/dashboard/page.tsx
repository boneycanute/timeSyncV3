"use client";

import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { SchedulerProvider } from "@/providers/schedular-provider";
import { useGoogleTokens } from "@/hooks/useGoogleTokens";
import { useEffect, useState, useCallback } from "react";
import { Event } from "@/types";
import { Spinner } from "@nextui-org/spinner";
import {
  addGoogleEvent,
  updateGoogleEvent,
  deleteGoogleEvent,
  convertGoogleEvent,
} from "@/utils/google-calendar";
import { toast } from "sonner";
import ChatUI from "@/components/chat/chat-ui";

export default function Home() {
  const { tokens, loading, error } = useGoogleTokens();
  const [events, setEvents] = useState<Event[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchGoogleEvents = useCallback(async () => {
    if (!tokens?.google_access_token) return;
    setIsFetchingEvents(true);

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
          new URLSearchParams({
            timeMin: new Date(
              new Date().setMonth(new Date().getMonth() - 1)
            ).toISOString(),
            timeMax: new Date(
              new Date().setMonth(new Date().getMonth() + 2)
            ).toISOString(),
            singleEvents: "true",
            orderBy: "startTime",
          }),
        {
          headers: {
            Authorization: `Bearer ${tokens.google_access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();

      const formattedEvents: Event[] = data.items
        .filter((item: any) => item.status !== "cancelled")
        .map(convertGoogleEvent);

      console.log("✅ Fetched Google Calendar events:", formattedEvents.length);
      setEvents(formattedEvents);
      setFetchError(null);
    } catch (err) {
      console.error("❌ Error fetching Google Calendar events:", err);
      setFetchError(
        err instanceof Error ? err.message : "Failed to fetch events"
      );
      toast.error("Error fetching events", {
        description:
          err instanceof Error ? err.message : "Failed to fetch events",
      });
    } finally {
      setIsFetchingEvents(false);
    }
  }, [tokens?.google_access_token]);

  useEffect(() => {
    if (tokens?.google_access_token && !loading) {
      fetchGoogleEvents();
    }
  }, [tokens, loading, fetchGoogleEvents]);

  const handleAddEvent = async (event: Event) => {
    if (!tokens?.google_access_token) {
      toast.error("Authentication Required", {
        description: "Please log in with Google to add events.",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const newEvent = await addGoogleEvent(tokens.google_access_token, event);
      toast.success("Event Added", {
        description: "Successfully added event to Google Calendar",
      });
      // Refresh events to get the newly added event
      await fetchGoogleEvents();
    } catch (err) {
      toast.error("Error Adding Event", {
        description: err instanceof Error ? err.message : "Failed to add event",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateEvent = async (event: Event) => {
    if (!tokens?.google_access_token) return;
    setIsSyncing(true);
    try {
      await updateGoogleEvent(tokens.google_access_token, event);
      toast.success("Event Updated", {
        description: "Successfully updated event in Google Calendar",
      });
      await fetchGoogleEvents();
    } catch (err) {
      toast.error("Error Updating Event", {
        description:
          err instanceof Error ? err.message : "Failed to update event",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!tokens?.google_access_token) return;
    setIsSyncing(true);
    try {
      await deleteGoogleEvent(tokens.google_access_token, id);
      toast.success("Event Deleted", {
        description: "Successfully deleted event from Google Calendar",
      });
      await fetchGoogleEvents();
    } catch (err) {
      toast.error("Error Deleting Event", {
        description:
          err instanceof Error ? err.message : "Failed to delete event",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <p className="text-lg text-danger">
          Error: {error?.message || fetchError}
        </p>
        <p className="text-sm text-muted-foreground">
          {!tokens?.google_access_token &&
            "Please ensure you're logged in with Google to view your calendar."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-64px)] bg-background relative">
      <div className="fixed w-[30%] h-[calc(100vh-64px)] p-4">
        <ChatUI />
      </div>
      <div className="w-[30%]">
        {/* This is a spacer div to maintain layout since the chat UI is fixed */}
      </div>
      <div className="w-[70%] p-4">
        {isSyncing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Spinner size="lg" label="Syncing with Google Calendar..." />
          </div>
        )}
        <SchedulerProvider
          initialState={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        >
          <SchedulerWrapper />
        </SchedulerProvider>
      </div>
    </div>
  );
}
