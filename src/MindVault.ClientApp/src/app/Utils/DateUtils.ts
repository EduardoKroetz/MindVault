import { format, isValid, parseISO } from "date-fns";

export default class DateUtils {
  static FormatDateTime(date: Date): string {
    return format(date, "dd/MM/yyyy HH:mm");
  }
  
  static FormatDateOnly(date: Date): string {
    return format(date, "dd/MM/yyyy");
  }

  static FormatToYYYYMMDD = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  }

  static ConvertToDate = (input: string | number | readonly string[]): Date | null => {
    if (typeof input === "string") {
      const date = parseISO(input);
      return isValid(date) ? date : null;
    } else if (typeof input === "number") {
      const date = new Date(input);
      return isValid(date) ? date : null;
    } else if (Array.isArray(input) && input.length > 0) {
      const date = parseISO(input[0]);
      return isValid(date) ? date : null;
    }
    return null;
  };
}