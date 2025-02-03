import { Event } from "@/types";

export async function addGoogleEvent(accessToken: string, event: Event) {
  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.startDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.endDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          location: event.location,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add event: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
}

export async function updateGoogleEvent(accessToken: string, event: Event) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.startDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.endDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          location: event.location,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating event in Google Calendar:', error);
    throw error;
  }
}

export async function deleteGoogleEvent(accessToken: string, eventId: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error);
    throw error;
  }
}

export function convertGoogleEvent(item: any): Event {
  return {
    id: item.id,
    title: item.summary || 'Untitled Event',
    startDate: new Date(item.start.dateTime || item.start.date),
    endDate: new Date(item.end.dateTime || item.end.date),
    variant: item.colorId ? 
      parseInt(item.colorId) <= 4 ? "primary" :
      parseInt(item.colorId) <= 7 ? "success" :
      parseInt(item.colorId) <= 9 ? "warning" : "danger"
      : "primary",
    description: item.description || "",
    location: item.location || "",
    allDay: !item.start.dateTime,
  };
}
