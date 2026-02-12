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

export function getNewGuestsToImport(existingGuests: Guest[]): Omit<Guest, "id">[] {
  const existingNames = new Set(existingGuests.map((g) => g.name.toLowerCase()));
  return getImportedGuests().filter(
    (guest) => !existingNames.has(guest.name.toLowerCase())
  );
}
