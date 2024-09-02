import { DateTime } from "luxon";

export function convertTimzeone(date: Date, timezoneOffset: string) {
  const dt = DateTime.fromJSDate(date, { zone: "utc" });
  return dt.setZone(timezoneOffset).toFormat("yyyy-MM-dd hh:mm a");
}
