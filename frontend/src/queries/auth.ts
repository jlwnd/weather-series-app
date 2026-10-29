import { send } from "./client";

export type LoginResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export const login = (username: string, password: string) =>
  send<LoginResponse>("POST", "/api/auth/login", {
    body: { username, password },
  });

export const logout = (token: string) =>
  send("POST", "/api/auth/logout", { token });

export const changePassword = (
  token: string,
  currentPassword: string,
  newPassword: string,
) =>
  send("PUT", "/api/auth/password", {
    token,
    body: { currentPassword, newPassword },
  });
