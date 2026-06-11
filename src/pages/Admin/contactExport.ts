import type { Contact, ProjectSummary } from '../../api/adminApi';
import { STUDENT_ROSTER, resolveStudent, studentDisplayLabel, type StudentRosterEntry } from './studentRoster';

const CSV_UTF8_BOM = '\uFEFF';
const CONTACT_COLUMNS = ['프로젝트', '팀', '회사/기관', '담당자', '직책', '전화번호', '이메일', '메모', '상태', '등록일'] as const;
const STATUS_LABELS: Record<Contact['status'], string> = {
  new: '신규',
  checked: '확인',
  archived: '보관',
  deleted: '삭제',
};

type ExportContactGroup = {
  readonly student: StudentRosterEntry | null;
  readonly displayName: string;
  readonly contacts: readonly Contact[];
};

export function downloadContactsCsv(
  contacts: readonly Contact[],
  projectsById: ReadonlyMap<string, ProjectSummary>,
  classFilter: string,
): void {
  const csv = buildContactsCsv(contacts, projectsById, classFilter);
  const blob = new Blob([CSV_UTF8_BOM, csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ieum_contacts_${dateStamp()}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function buildContactsCsv(
  contacts: readonly Contact[],
  projectsById: ReadonlyMap<string, ProjectSummary>,
  classFilter: string,
): string {
  const groups = buildExportGroups(contacts, classFilter);
  const maxContactCount = Math.max(1, ...groups.map((group) => group.contacts.length));
  const headers = [
    '학번',
    '이름',
    '반',
    '채용희망수',
    ...Array.from({ length: maxContactCount }, (_, index) => CONTACT_COLUMNS.map((column) => `${index + 1} ${column}`)).flat(),
  ];
  const rows = groups.map((group) => [
    group.student?.studentNumber ?? '',
    group.student?.name ?? group.displayName,
    group.student ? `${group.student.studentNumber.charAt(1)}반` : '',
    String(group.contacts.length),
    ...Array.from({ length: maxContactCount }, (_, index) => contactCells(group.contacts[index], projectsById)).flat(),
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}

function buildExportGroups(contacts: readonly Contact[], classFilter: string): readonly ExportContactGroup[] {
  const contactsByStudent = new Map<string, Contact[]>();
  const unknownGroups = new Map<string, Contact[]>();
  for (const contact of contacts) {
    const student = resolveStudent(contact.targetMemberUser?.name);
    if (student) {
      const contactsForStudent = contactsByStudent.get(student.studentNumber) ?? [];
      contactsForStudent.push(contact);
      contactsByStudent.set(student.studentNumber, contactsForStudent);
      continue;
    }
    const key = contact.targetMemberUserId || contact.id;
    const contactsForUnknown = unknownGroups.get(key) ?? [];
    contactsForUnknown.push(contact);
    unknownGroups.set(key, contactsForUnknown);
  }
  const classDigit = classFilter === '전체' ? null : classFilter.charAt(0);
  const rosterGroups = STUDENT_ROSTER
    .filter((student) => !classDigit || student.studentNumber.charAt(1) === classDigit)
    .map((student) => ({
      student,
      displayName: student.name,
      contacts: contactsByStudent.get(student.studentNumber) ?? [],
    }));
  const unmatchedGroups = [...unknownGroups.values()].map((groupContacts) => ({
    student: null,
    displayName: studentDisplayLabel(groupContacts[0]?.targetMemberUser?.name),
    contacts: groupContacts,
  }));
  return [...rosterGroups, ...unmatchedGroups];
}

function contactCells(contact: Contact | undefined, projectsById: ReadonlyMap<string, ProjectSummary>): readonly string[] {
  if (!contact) return CONTACT_COLUMNS.map(() => '');
  const project = contact.project ?? projectsById.get(contact.projectId);
  return [
    project?.serviceName ?? '',
    project?.teamName ?? '',
    contact.organization ?? '',
    contact.name ?? '',
    contact.position ?? '',
    contact.phone ?? '',
    contact.email ?? '',
    contact.memo ?? '',
    STATUS_LABELS[contact.status],
    formatExportDate(contact.createdAt),
  ];
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatExportDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function dateStamp(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
