import type { Sensor, SensorCreated } from "../types";
import { send } from "./client";

export const getSensors = (token: string) =>
  send<Sensor[]>("GET", "/api/sensors", { token }).then((r) => r ?? []);

export const createSensor = (
  token: string,
  body: { name: string; seriesId: number },
) => send<SensorCreated>("POST", "/api/sensors", { token, body });

export const deleteSensor = (token: string, id: number) =>
  send<null>("DELETE", `/api/sensors/${id}`, { token });
