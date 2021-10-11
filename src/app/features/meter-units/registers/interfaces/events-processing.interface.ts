export interface EventsByTimestamp {
  timestamp: Date | any;
  count: number;
}

export interface EventsById {
  category: number;
  value: number;
  count: number;
  color?: string;
}
