export interface EventsByTimestamp {
  timestamp: Date;
  count: number;
}

export interface EventsById {
  category: number;
  value: number;
  count: number;
  color?: string;
}
