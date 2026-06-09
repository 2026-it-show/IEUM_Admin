import { useMemo, useState } from 'react';
import {
  fetchContactDetail,
  updateContactStatus,
  type AdminSnapshot,
  type Contact,
  type ProjectSummary,
} from '../../../api/adminApi';
import { CLASS_FILTERS, STAFF_VIEW_LABELS, sortByDate, type SortKey, type StaffViewKey } from '../adminTypes';
import { AdminManagement } from './AdminManagement';
import { ContactDetail } from './ContactDetail';
import { FeedbackList } from './FeedbackList';
import * as S from '../AdminDashboard.styled';

type StaffDashboardProps = {
  readonly snapshot: AdminSnapshot;
  readonly view: StaffViewKey;
  readonly setView: (view: StaffViewKey) => void;
  readonly sort: SortKey;
  readonly setSort: (sort: SortKey) => void;
  readonly token: string;
  readonly refresh: () => Promise<void>;
  readonly isPreview?: boolean;
};

export function StaffDashboard({ snapshot, view, setView, sort, setSort, token, refresh, isPreview = false }: StaffDashboardProps) {
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('전체');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const projectsById = useMemo(() => new Map(snapshot.projects.items.map((project) => [project.id, project])), [snapshot.projects.items]);
  const contacts = sortByDate(filterContacts(snapshot.contacts.items, projectsById, query), sort);
  const feedback = sortByDate(
    snapshot.feedback.items.map((item) => ({ ...item, project: projectsById.get(item.projectId) })),
    sort,
  );

  if (selectedContact) {
    return (
      <S.Content>
        <ContactDetail contact={selectedContact} project={projectsById.get(selectedContact.projectId)} onBack={() => setSelectedContact(null)} />
      </S.Content>
    );
  }

  return (
    <S.Content>
      <S.Desk>
        <S.SearchRow>
          <S.SearchBox>
            <S.SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="학생의 이름 혹은 학번을 검색하세요" />
            <S.SearchIcon src="/assets/icons/search.svg" alt="" aria-hidden="true" />
          </S.SearchBox>
          <S.SortSelect value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="정렬">
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </S.SortSelect>
        </S.SearchRow>
        <S.ActionStrip>
          <S.TabGroup aria-label="반 필터">
            {CLASS_FILTERS.map((label) => (
              <S.TabButton key={label} type="button" $active={classFilter === label} onClick={() => setClassFilter(label)}>
                {label}
              </S.TabButton>
            ))}
          </S.TabGroup>
          {snapshot.user.role === 'admin' ? <ModeSwitch view={view} setView={setView} /> : null}
        </S.ActionStrip>
        {view === 'contacts' ? (
          <ContactList
            contacts={contacts}
            projectsById={projectsById}
            token={token}
            onSelect={setSelectedContact}
            onChanged={refresh}
            isPreview={isPreview}
          />
        ) : (
          <FeedbackList feedback={feedback} token={token} canModerate={!isPreview} onChanged={refresh} />
        )}
        {snapshot.user.role === 'admin' ? <AdminManagement snapshot={snapshot} token={token} onChanged={refresh} isPreview={isPreview} /> : null}
      </S.Desk>
    </S.Content>
  );
}

function ModeSwitch({ view, setView }: { readonly view: StaffViewKey; readonly setView: (view: StaffViewKey) => void }) {
  return (
    <S.TabGroup aria-label="관리 보기">
      {(Object.keys(STAFF_VIEW_LABELS) as StaffViewKey[]).map((key) => (
        <S.TabButton key={key} type="button" $active={view === key} onClick={() => setView(key)}>
          {STAFF_VIEW_LABELS[key]}
        </S.TabButton>
      ))}
    </S.TabGroup>
  );
}

function ContactList({
  contacts,
  projectsById,
  token,
  onSelect,
  onChanged,
  isPreview,
}: {
  readonly contacts: readonly Contact[];
  readonly projectsById: ReadonlyMap<string, ProjectSummary>;
  readonly token: string;
  readonly onSelect: (contact: Contact) => void;
  readonly onChanged: () => Promise<void>;
  readonly isPreview: boolean;
}) {
  if (contacts.length === 0) return <S.EmptyState>아직 채용을 희망하는 회사가 없습니다</S.EmptyState>;
  return (
    <S.ContactGrid>
      {contacts.map((contact) => (
        <S.ContactCard
          key={contact.id}
          type="button"
          onClick={async () => {
            onSelect(await fetchContactDetail(token, contact.id).catch(() => contact));
            if (!isPreview && contact.status === 'new') {
              await updateContactStatus(token, contact.id, 'checked');
              await onChanged();
            }
          }}
        >
          <S.CardTitle>{contact.name ?? '담당자'}</S.CardTitle>
          <S.ContactOrg>{contact.organization ?? projectsById.get(contact.projectId)?.serviceName ?? '-'}</S.ContactOrg>
          {contact.status === 'new' ? <S.NewDot /> : null}
        </S.ContactCard>
      ))}
    </S.ContactGrid>
  );
}

function filterContacts(
  contacts: readonly Contact[],
  projectsById: ReadonlyMap<string, ProjectSummary>,
  query: string,
): readonly Contact[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return contacts;
  return contacts.filter((contact) => {
    const project = projectsById.get(contact.projectId);
    return [contact.name, contact.organization, contact.email, contact.phone, project?.serviceName, project?.teamName]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(normalized));
  });
}
