import type { ProjectSummary } from '../../api/adminApi';

export type StaffViewKey = 'contacts' | 'feedback';
export type AdminManageKey = 'projects' | 'users' | 'bannedWords';
export type SortKey = 'latest' | 'oldest';
export type LoadStatus = 'loading' | 'ready' | 'error';

export const CLASS_FILTERS = ['전체', '1반', '2반', '3반', '4반', '5반', '6반'] as const;
export const STAFF_VIEW_LABELS: Record<StaffViewKey, string> = {
  contacts: '채용희망',
  feedback: '피드백',
};

export const ADMIN_MANAGE_LABELS: Record<AdminManageKey, string> = {
  projects: '프로젝트',
  users: '사용자',
  bannedWords: '금칙어',
};

const CATEGORY_COLORS: Record<string, string> = {
  ai: '#5EAEDB',
  human: '#F399BE',
  network: '#F4827E',
  personal: '#24AE53',
  creative: '#F9C96B',
  journey: '#B68FCF',
  global: '#D88E70',
};

export function projectColor(project: ProjectSummary | undefined): string {
  return CATEGORY_COLORS[project?.experienceCategory ?? ''] ?? '#F399BE';
}

export function initialOf(name: string): string {
  return name.trim().slice(0, 1) || 'I';
}

export function roleLabel(role: 'student' | 'teacher' | 'admin'): string {
  if (role === 'admin') return '관리자';
  if (role === 'teacher') return '선생님';
  return '학생';
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function sortByDate<T extends { readonly createdAt: string }>(items: readonly T[], sort: SortKey): readonly T[] {
  return [...items].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sort === 'latest' ? diff : -diff;
  });
}
