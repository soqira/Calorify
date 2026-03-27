//пока что копия из calories/lib/calories-date.util.ts

import dayjs from "dayjs";
import "dayjs/locale/ru";
import type { FormattedDate } from "../../../pages/calories-page/interfaces/calories-date.interface.ts";

const DATE_FORMAT = "YYYY-MM-DD";

function getToday(): string {
  return dayjs().format(DATE_FORMAT);
}

function getYesterday(): string {
  return dayjs().subtract(1, "day").format(DATE_FORMAT);
}

function formatApiDate(date?: string): string {
  return dayjs(date).format(DATE_FORMAT);
}

function formatFullDate(dateStr: string): string {
  return dayjs(dateStr).format("D MMMM YYYY");
}

function formatDate(dateStr: string): FormattedDate {
  const d = dayjs(dateStr);
  const today = getToday();
  const yesterday = getYesterday();

  if (dateStr === today)
    return { top: "Сегодня", bottom: d.format("D MMMM"), isToday: true };
  if (dateStr === yesterday)
    return { top: "Вчера", bottom: d.format("D MMMM"), isToday: false };
  return {
    top: d.format("D MMMM"),
    bottom: d.format("D MMMM"),
    isToday: false,
  };
}

export const DateUtils = {
  getToday,
  getYesterday,
  formatApiDate,
  formatFullDate,
  formatDate,
};
