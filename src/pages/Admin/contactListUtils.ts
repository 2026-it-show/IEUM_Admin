import type { Contact, ProjectSummary } from '../../api/adminApi';
import { resolveStudent, studentClassDigit, studentDisplayLabel } from './studentRoster';

export type ContactGroup = {
  readonly key: string;
  readonly contacts: readonly Contact[];
};

export function filterContactsByClass(
  contacts: readonly Contact[],
  classFilter: string,
): readonly Contact[] {
  if (classFilter === '전체') return contacts;
  const classDigit = classFilter.charAt(0);
  return contacts.filter(
    (contact) => studentClassDigit(contact.targetMemberUser?.name) === classDigit,
  );
}

export function filterContacts(
  contacts: readonly Contact[],
  projectsById: ReadonlyMap<string, ProjectSummary>,
  query: string,
): readonly Contact[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return contacts;
  return contacts.filter((contact) => {
    const project = projectsById.get(contact.projectId);
    const student = resolveStudent(contact.targetMemberUser?.name);
    return [
      contact.targetMemberUser?.name,
      student?.studentNumber,
      student?.name,
      contact.name,
      contact.organization,
      contact.email,
      contact.phone,
      project?.serviceName,
      project?.teamName,
    ]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(normalized));
  });
}

export function groupContactsByTargetStudent(contacts: readonly Contact[]): readonly ContactGroup[] {
  const groups = new Map<string, Contact[]>();
  for (const contact of contacts) {
    const key = contactGroupKey(contact);
    const group = groups.get(key);
    if (group) {
      group.push(contact);
      continue;
    }
    groups.set(key, [contact]);
  }
  return [...groups.entries()].map(([key, groupContacts]) => ({
    key,
    contacts: groupContacts,
  }));
}

export function contactGroupKey(contact: Contact): string {
  return contact.targetMemberUserId || contact.id;
}

export function studentDisplayName(contact: Contact): string {
  return studentDisplayLabel(contact.targetMemberUser?.name);
}

export function groupSummary(
  contacts: readonly Contact[],
  projectsById: ReadonlyMap<string, ProjectSummary>,
): string {
  const first = contacts[0];
  const firstName = first.organization ?? projectsById.get(first.projectId)?.serviceName ?? '-';
  return contacts.length > 1 ? `${firstName} 외 ${contacts.length - 1}건` : firstName;
}
