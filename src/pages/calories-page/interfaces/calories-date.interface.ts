export interface FormattedDate {
  top: string;
  bottom: string;
  isToday: boolean;
}

export interface SelectedDate {
  date: string;
}

export interface HistoryProps {
  mealDays: string[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  loading: boolean;
}
