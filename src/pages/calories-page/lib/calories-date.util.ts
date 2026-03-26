import dayjs from "dayjs";
import "dayjs/locale/ru";
import type { FormattedDate } from "../interfaces/calories-date.interface";

dayjs.locale("ru");

export function formatDate(dateStr: string): FormattedDate {
  const d = dayjs(dateStr);
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  if (dateStr === today)
    return { top: "Сегодня", bottom: d.format("D MMMM"), isToday: true };
  if (dateStr === yesterday)
    return { top: "Вчера", bottom: d.format("D MMMM"), isToday: false };
  return { top: d.format("D MMMM"), bottom: d.format("dddd"), isToday: false };
}

export function formatFullDate(dateStr: string): string {
  return dayjs(dateStr).format("D MMMM YYYY");
}
