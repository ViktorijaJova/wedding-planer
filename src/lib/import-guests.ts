import { Guest } from "@/components/wedding-template/WeddingTemplateProvider";
import guestsData from "./guests-data.json";

export function getImportedGuests(): Omit<Guest, "id">[] {
  return guestsData.guests.map((guest) => ({
    name: guest.name,
    side: guest.side as Guest["side"],
    group: guest.group,
    saveTheDateSent: guest.saveTheDateSent,
    inviteSent: false,
    rsvp: "pending" as const,
    plusOne: guest.plusOne || false,
    notes: guest.notes || "",
  }));
}

export function getNewGuestsToImport(_existingGuests: Guest[]): Omit<Guest, "id">[] {
  // Allow duplicate names – real weddings can have multiple people called the same name.
  // Each guest gets a unique ID on import so duplicates are safe.
  return getImportedGuests();
}
