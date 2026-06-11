const API_BASE_URL = import.meta.env.VITE_IEUM_API_BASE_URL ?? '/api';

export type AdminUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly profileImageUrl: string | null;
  readonly role: 'student' | 'teacher' | 'admin';
};

export type CursorPage<T> = {
  readonly items: readonly T[];
  readonly nextCursor: string | null;
};

export type StatusCounts = Record<string, number | undefined>;

export type DashboardStats = {
  readonly projectCount: number;
  readonly feedbackCount: number;
  readonly contactCount: number;
  readonly newContactCount: number;
  readonly interestCount: number;
  readonly feedbackByStatus: StatusCounts;
  readonly contactsByStatus: StatusCounts;
};

export type ProjectSummary = {
  readonly id: string;
  readonly serviceName: string;
  readonly teamName: string;
  readonly description: string | null;
  readonly thumbnailUrl: string | null;
  readonly experienceCategory: string | null;
  readonly boothSlot: string | null;
  readonly acceptsFeedback: boolean;
  readonly isPublished: boolean;
  readonly feedbackCount: number;
  readonly contactCount: number;
  readonly interestCount?: number;
};

export type FeedbackStatus = 'public' | 'blocked' | 'deleted';

export type Feedback = {
  readonly id: string;
  readonly projectId: string;
  readonly content: string;
  readonly status: FeedbackStatus;
  readonly moderationReason: string | null;
  readonly createdAt: string;
};

export type ContactStatus = 'new' | 'checked' | 'archived' | 'deleted';

export type Contact = {
  readonly id: string;
  readonly projectId: string;
  readonly targetMemberUserId: string;
  readonly name: string | null;
  readonly organization: string | null;
  readonly position: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly memo: string | null;
  readonly status: ContactStatus;
  readonly createdAt: string;
  readonly project?: ProjectSummary;
  readonly targetMemberUser?: AdminUser;
};

export type BannedWord = {
  readonly id: string;
  readonly word: string;
  readonly isActive: boolean;
};

export type AdminSnapshot = {
  readonly user: AdminUser;
  readonly dashboard: DashboardStats;
  readonly projects: CursorPage<ProjectSummary>;
  readonly feedback: CursorPage<Feedback>;
  readonly contacts: CursorPage<Contact>;
  readonly users: CursorPage<AdminUser>;
  readonly bannedWords: CursorPage<BannedWord>;
};

export type StaffSnapshot = AdminSnapshot & {
  readonly kind: 'staff';
};

export type StudentProjectFeedback = {
  readonly project: ProjectSummary;
  readonly feedback: CursorPage<Feedback>;
};

export type StudentSnapshot = {
  readonly kind: 'student';
  readonly user: AdminUser;
  readonly projects: readonly ProjectSummary[];
  readonly projectFeedback: readonly StudentProjectFeedback[];
};

export type HomeSnapshot = StaffSnapshot | StudentSnapshot;

type ApiEnvelope<T> = {
  readonly data: T;
};

type LoginResponse = {
  readonly user: AdminUser;
  readonly token: string;
};

export async function loginWithMirimToken(accessToken: string): Promise<AdminUser> {
  const session = await request<LoginResponse>('/auth/login', accessToken, {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
  });
  localStorage.setItem('ieum_admin_token', session.token);
  return session.user;
}

export function readStoredToken(): string {
  return localStorage.getItem('ieum_admin_token') ?? '';
}

export function clearStoredToken(): void {
  localStorage.removeItem('ieum_admin_token');
}

export async function logout(accessToken: string): Promise<void> {
  await request<{ status: string }>('/auth/logout', accessToken, { method: 'POST' });
  clearStoredToken();
}

export async function fetchHomeSnapshot(accessToken: string): Promise<HomeSnapshot> {
  const user = await request<AdminUser>('/auth/me', accessToken);
  if (user.role === 'student') {
    const projects = await request<readonly ProjectSummary[]>('/student/projects', accessToken);
    const projectFeedback = await Promise.all(
      projects.map(async (project) => ({
        project,
        feedback: await request<CursorPage<Feedback>>(`/student/projects/${project.id}/feedback?limit=80`, accessToken),
      })),
    );
    return { kind: 'student', user, projects, projectFeedback };
  }
  return { kind: 'staff', ...(await fetchAdminSnapshot(accessToken, user)) };
}

export async function fetchAdminSnapshot(accessToken: string, knownUser?: AdminUser): Promise<AdminSnapshot> {
  const [user, dashboard, projects, feedback, contacts, users, bannedWords] = await Promise.all([
    knownUser ? Promise.resolve(knownUser) : request<AdminUser>('/auth/me', accessToken),
    request<DashboardStats>('/admin/dashboard', accessToken),
    request<CursorPage<ProjectSummary>>('/admin/projects?limit=80', accessToken),
    request<CursorPage<Feedback>>('/admin/feedback?limit=80', accessToken),
    request<CursorPage<Contact>>('/admin/contacts?limit=80', accessToken),
    request<CursorPage<AdminUser>>('/admin/users?limit=80', accessToken),
    fetchAllBannedWords(accessToken),
  ]);
  return { user, dashboard, projects, feedback, contacts, users, bannedWords };
}

async function fetchAllBannedWords(accessToken: string): Promise<CursorPage<BannedWord>> {
  const items: BannedWord[] = [];
  let cursor: string | null = null;
  do {
    const query = new URLSearchParams({ limit: '80' });
    if (cursor) query.set('cursor', cursor);
    const page = await request<CursorPage<BannedWord>>(
      `/admin/banned-words?${query.toString()}`,
      accessToken,
    );
    items.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);

  return { items, nextCursor: null };
}

export async function updateFeedbackStatus(
  accessToken: string,
  id: string,
  status: FeedbackStatus,
): Promise<Feedback> {
  return request<Feedback>(`/admin/feedback/${id}/status`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function updateContactStatus(
  accessToken: string,
  id: string,
  status: ContactStatus,
): Promise<Contact> {
  return request<Contact>(`/admin/contacts/${id}/status`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchContactDetail(accessToken: string, id: string): Promise<Contact> {
  return request<Contact>(`/admin/contacts/${id}`, accessToken);
}

export async function createBannedWord(accessToken: string, word: string): Promise<BannedWord> {
  return request<BannedWord>('/admin/banned-words', accessToken, {
    method: 'POST',
    body: JSON.stringify({ word }),
  });
}

export async function updateBannedWord(accessToken: string, id: string, isActive: boolean): Promise<BannedWord> {
  return request<BannedWord>(`/admin/banned-words/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export async function deleteBannedWord(accessToken: string, id: string): Promise<void> {
  await request<{ status: string }>(`/admin/banned-words/${id}`, accessToken, { method: 'DELETE' });
}

async function request<T>(path: string, accessToken: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  });
  const payload: unknown = await readPayload(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(payload) ?? `API request failed: ${response.status}`);
  }
  return readEnvelope<T>(payload);
}

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 300) };
  }
}

function buildApiUrl(path: string): string {
  if (API_BASE_URL.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }
  return new URL(path, API_BASE_URL).toString();
}

function readEnvelope<T>(payload: unknown): T {
  if (isRecord(payload) && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

function readErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload) || !('message' in payload)) return null;
  const message = payload.message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join('\n');
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
