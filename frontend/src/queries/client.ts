async function toError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as { detail?: string; title?: string };
    if (typeof body.detail === "string") return new Error(body.detail);
    if (typeof body.title === "string") return new Error(body.title);
  } catch {
    // non-JSON body
  }
  return new Error(`${res.status} ${res.statusText}`);
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw await toError(res);
  return res.json() as Promise<T>;
}

type SendOpts = { token?: string | null; body?: unknown };

export async function send<T>(
  method: string,
  path: string,
  opts: SendOpts = {},
): Promise<T | null> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw await toError(res);
  return res.status === 204 ? null : (res.json() as Promise<T>);
}
