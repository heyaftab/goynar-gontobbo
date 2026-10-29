export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  role: "customer" | "admin" | "moderator" | "marketing" | "system_admin";
  avatar?: string | null;
  address?: string | null;
  created_at?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
  message?: string;
}

const TOKEN_KEY = "gg_auth_token";
const USER_KEY = "gg_auth_user";

function getApiBase(): string {
  return "/api/auth";
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export async function apiRegister(data: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await response.json() as AuthResponse & { errors?: Record<string, string[]> };
  if (!response.ok) {
    const firstError = payload.errors ? Object.values(payload.errors).flat()[0] : payload.message;
    throw new Error(firstError || "Registration failed.");
  }

  setStoredAuth(payload.token, payload.user);
  return payload;
}

export async function apiLogin(data: { email: string; password: string }): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await response.json() as AuthResponse;
  if (!response.ok) {
    throw new Error(payload.message || "Invalid credentials.");
  }

  setStoredAuth(payload.token, payload.user);
  return payload;
}

export async function apiGoogleSync(data: { email: string; name: string; google_id?: string; avatar?: string }): Promise<AuthResponse> {
  const response = await fetch(`${getApiBase()}/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await response.json() as AuthResponse;
  if (!response.ok) {
    throw new Error(payload.message || "Google sign-in sync failed.");
  }

  setStoredAuth(payload.token, payload.user);
  return payload;
}

export async function apiGetProfile(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch(`${getApiBase()}/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 401) clearStoredAuth();
      return null;
    }

    const payload = await response.json() as { user: AuthUser };
    setStoredAuth(token, payload.user);
    return payload.user;
  } catch {
    return getStoredUser();
  }
}

export async function apiUpdateProfile(data: { name?: string; phone?: string; address?: string }): Promise<AuthUser> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated.");

  const response = await fetch(`${getApiBase()}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await response.json() as { user: AuthUser; message?: string };
  if (!response.ok) throw new Error(payload.message || "Could not update profile.");

  setStoredAuth(token, payload.user);
  return payload.user;
}

export async function apiLogout(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${getApiBase()}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
    } catch {
      // Ignore network errors on logout
    }
  }
  clearStoredAuth();
}
