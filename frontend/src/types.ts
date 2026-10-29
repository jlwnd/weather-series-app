export type Series = {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  color: string;
  icon?: string | null;
  unit?: string | null;
};

export type Measurement = {
  id: number;
  seriesId: number;
  value: number;
  timestamp: string;
  sensorId?: number;
};
