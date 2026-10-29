export type Series = {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  color: string;
  icon?: string | null;
  unit?: string | null;
};

export type SeriesInput = {
  name: string;
  minValue: number;
  maxValue: number;
  color: string;
};

export type Sensor = {
  id: number;
  name: string;
  seriesId: number;
  createdAt: string;
};

export type SensorCreated = Sensor & {
  apiKey: string;
};

export type Measurement = {
  id: number;
  seriesId: number;
  value: number;
  timestamp: string;
  sensorId?: number;
};
