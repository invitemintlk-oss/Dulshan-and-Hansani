/**
 * Single source of truth for the wedding details.
 * The invitation page, the admin link generator and the RSVP / Wishes forms all read from here.
 */
export const WEDDING = {
  groom: {
    name: "Dulshan",
    parents: "Mr. & Mrs. Hettiarachchi",
  },
  bride: {
    name: "Hashini",
    parents: "Mr. & Mrs. Yaddehige",
  },

  // 24 January 2027 is a Sunday. Times are Sri Lanka time (UTC+05:30).
  dateLong: "Sunday, 24th January 2027",
  dateShort: "24 . 01 . 2027",
  month: "January",
  day: "24",
  weekday: "Sunday",
  year: "2027",
  startTime: "9.00 A.M.",
  endTime: "4.00 P.M.",
  poruwaTime: "11.01 A.M.",
  /** Countdown target: the Poruwa ceremony. */
  poruwaISO: "2027-01-24T11:01:00+05:30",

  venue: {
    name: "Saminro Hotel",
    city: "Kadawatha",
    country: "Sri Lanka",
    mapsLink: "https://maps.app.goo.gl/jMZjsLjPteHkCtS79",
  },
} as const;

export const COUPLE_NAMES = `${WEDDING.groom.name} & ${WEDDING.bride.name}`;
export const MONOGRAM = `${WEDDING.groom.name[0]}&${WEDDING.bride.name[0]}`;

/** Google Apps Script Web App (Code.ts) that writes RSVPs and wishes to the Google Sheet. */
export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby9qzitcIAQYtKg2mSI2uYLtQYYoKFysCAT0s-oUGRh-Uqbuu9CYd_lnE0hjOeMiQs-/exec";
