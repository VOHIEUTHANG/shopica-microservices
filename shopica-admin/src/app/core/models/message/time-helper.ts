export function convertToLocalTime(UTCTimeString: string | Date): Date {
  const UTCTime = new Date(UTCTimeString);
  UTCTime.setMinutes(UTCTime.getMinutes() - UTCTime.getTimezoneOffset());
  return UTCTime;
}
