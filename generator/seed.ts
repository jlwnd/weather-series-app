import { parseArgs } from "node:util";
import { fetchArchiveHourly, postMeasurement } from "./src/lib.ts";

const { values: o } = parseArgs({
  options: {
    api: {
      type: "string",
      default: process.env.API_URL ?? "http://localhost:3000",
    },
    user: { type: "string", default: process.env.ADMIN_USERNAME ?? "admin" },
    pass: {
      type: "string",
      default: process.env.ADMIN_PASSWORD ?? "admin12345",
    },
  },
});

const api = o.api!.replace(/\/+$/, "");

const CITIES = [
  {
    name: "Warszawa",
    lat: 52.2297,
    lon: 21.0122,
    color: "#1f77b4",
    minValue: -25,
    maxValue: 40,
  },
  {
    name: "Funchal",
    lat: 32.6669,
    lon: -16.9241,
    color: "#ff7f0e",
    minValue: 5,
    maxValue: 40,
  },
  {
    name: "Heraklion",
    lat: 35.3387,
    lon: 25.1442,
    color: "#2ca02c",
    minValue: -5,
    maxValue: 45,
  },
  {
    name: "Busan",
    lat: 35.1796,
    lon: 129.0756,
    color: "#d62728",
    minValue: -15,
    maxValue: 40,
  },
];

const to = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
const from = new Date(Date.now() - 9 * 86_400_000).toISOString().slice(0, 10);

async function json(
  method: string,
  path: string,
  token: string | undefined,
  body?: unknown,
) {
  const res = await fetch(`${api}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : undefined };
}

const login = await json("POST", "/api/auth/login", undefined, {
  username: o.user,
  password: o.pass,
});
if (login.status !== 200) {
  console.error(`Login failed (${login.status}). Check --user/--pass.`);
  process.exit(1);
}
const token: string = login.json.accessToken;

const existing = (await json("GET", "/api/series", undefined)).json as {
  name: string;
}[];
const existingNames = new Set(existing.map((s) => s.name));

for (const city of CITIES) {
  if (existingNames.has(city.name)) {
    console.log(`Series "${city.name}" already exists, skipping.`);
    continue;
  }

  const created = await json("POST", "/api/series", token, {
    name: city.name,
    minValue: city.minValue,
    maxValue: city.maxValue,
    color: city.color,
  });
  if (created.status !== 201) {
    console.error(`Failed to create series "${city.name}" (${created.status})`);
    continue;
  }
  const seriesId = created.json.id;

  const sensor = await json("POST", "/api/sensors", token, {
    name: `${city.name} sensor`,
    seriesId,
  });
  if (sensor.status !== 201) {
    console.error(
      `Failed to register sensor for "${city.name}" (${sensor.status})`,
    );
    continue;
  }
  const key: string = sensor.json.apiKey;

  console.log(
    `Seeding "${city.name}" (series ${seriesId}) from Open-Meteo ${from}..${to}`,
  );
  const points = await fetchArchiveHourly(city.lat, city.lon, from, to);
  let ok = 0;
  for (const p of points) {
    try {
      await postMeasurement(api, key, p.value, p.timestamp);
      ok++;
    } catch (err) {
      console.error(`  ${(err as Error).message}`);
    }
  }
  console.log(`  ${ok}/${points.length} measurements stored.`);
}

console.log("Seed complete.");
