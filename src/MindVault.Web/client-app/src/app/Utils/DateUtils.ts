import { format } from "date-fns";

export default class DateUtils {
  static FormatDateTime(date: Date): string {
    return format(date, "dd/MM/yyyy HH:mm");
  }
  
  static FormatDateOnly(date: Date): string {
    return format(date, "dd/MM/yyyy");
  }

  static FormatToYYYYMMDD = (date: Date) => format(date, "yyyy-MM-dd");

}