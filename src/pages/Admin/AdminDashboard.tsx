import { useEffect, useMemo, useState } from 'react';
import {
  clearStoredToken,
  fetchAdminSnapshot,
  readStoredToken,
  updateContactStatus,
  updateFeedbackStatus,
  type AdminSnapshot,
  type Contact,
  type Feedback,
  type ProjectSummary,
} from '../../api/adminApi';
import * as S from './AdminDashboard.styled';

type ViewKey = 'feedback' | 'contacts' | 'projects' | 'users';
type SortKey = 'latest' | 'oldest';

const VIEW_LABELS: Record<ViewKey, string> = {
  feedback: '피드백',
  contacts: '채용',
  projects: '프로젝트',
  users: '사용자',
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

function AdminDashboard() {
  const token = useMemo(() => readStoredToken(), []);
  const [view, setView] = useState<ViewKey>('feedback');
  const [sort, setSort] = useState<SortKey>('latest');
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const refresh = async () => {
    await loadSnapshot(token, setSnapshot, setStatus, setMessage);
  };

  useEffect(() => {
    void refresh();
  }, []);

  if (status === 'loading') return <S.Center>관리자 데이터를 불러오는 중입니다</S.Center>;
  if (status === 'error' || !snapshot) {
    return (
      <S.Center>
        <S.ErrorText>{message || '관리자 데이터를 불러오지 못했습니다'}</S.ErrorText>
        <S.PrimaryButton type="button" onClick={() => window.location.assign('/')}>
          로그인으로 이동
        </S.PrimaryButton>
      </S.Center>
    );
  }

  const projectsById = new Map(snapshot.projects.items.map((project) => [project.id, project]));
  const sortedFeedback = sortByDate(snapshot.feedback.items, sort);
  const sortedContacts = sortByDate(snapshot.contacts.items, sort);

  return (
    <S.Page>
      <S.Topbar>
        <S.Logo src="/assets/figma/header-logo.svg" alt="IEUM" />
        <S.ProfileButton type="button" onClick={() => setProfileOpen((open) => !open)}>
          {initialOf(snapshot.user.name)}
        </S.ProfileButton>
        {profileOpen ? (
          <S.ProfileCard>
            <S.ProfileRow>
              <S.Avatar>{initialOf(snapshot.user.name)}</S.Avatar>
              <div>
                <S.ProfileName>{snapshot.user.name}</S.ProfileName>
                <S.ProfileEmail>{snapshot.user.email}</S.ProfileEmail>
              </div>
            </S.ProfileRow>
            <S.LogoutButton
              type="button"
              onClick={() => {
                clearStoredToken();
                window.location.assign('/');
              }}
            >
              로그아웃
            </S.LogoutButton>
          </S.ProfileCard>
        ) : null}
      </S.Topbar>

      <S.Content>
        <S.Toolbar>
          <S.TabGroup>
            {(Object.keys(VIEW_LABELS) as ViewKey[]).map((key) => (
              <S.TabButton
                key={key}
                type="button"
                $active={view === key}
                onClick={() => {
                  setView(key);
                  setSelectedContact(null);
                }}
              >
                {VIEW_LABELS[key]}
              </S.TabButton>
            ))}
          </S.TabGroup>
          <S.SortSelect value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </S.SortSelect>
        </S.Toolbar>

        {message ? <S.Notice>{message}</S.Notice> : null}
        {view === 'feedback' ? (
          <FeedbackBoard
            feedback={sortedFeedback}
            projectsById={projectsById}
            token={token}
            onChanged={refresh}
          />
        ) : null}
        {view === 'contacts' ? (
          <ContactBoard
            contacts={sortedContacts}
            projectsById={projectsById}
            selectedContact={selectedContact}
            token={token}
            onSelect={setSelectedContact}
            onChanged={refresh}
          />
        ) : null}
        {view === 'projects' ? <ProjectBoard projects={snapshot.projects.items} /> : null}
        {view === 'users' ? <UserBoard snapshot={snapshot} /> : null}
      </S.Content>
    </S.Page>
  );
}

function FeedbackBoard({
  feedback,
  projectsById,
  token,
  onChanged,
}: {
  readonly feedback: readonly Feedback[];
  readonly projectsById: ReadonlyMap<string, ProjectSummary>;
  readonly token: string;
  readonly onChanged: () => Promise<void>;
}) {
  if (feedback.length === 0) return <S.EmptyState>아직 받은 피드백이 없습니다</S.EmptyState>;
  return (
    <S.Masonry>
      {feedback.map((item) => {
        const project = projectsById.get(item.projectId);
        return (
          <S.FeedbackCard key={item.id}>
            <S.ProjectChip $color={projectColor(project)}>{project?.serviceName ?? 'Project'}</S.ProjectChip>
            <S.CardTitle>{project?.teamName ?? project?.serviceName ?? '프로젝트'}</S.CardTitle>
            <S.CardBody>{item.content}</S.CardBody>
            <S.CardFooter>
              <span>{formatDate(item.createdAt)}</span>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  await updateFeedbackStatus(token, item.id, item.status === 'public' ? 'blocked' : 'public');
                  await onChanged();
                }}
              >
                {item.status === 'public' ? '숨김' : '공개'}
              </S.MiniButton>
            </S.CardFooter>
          </S.FeedbackCard>
        );
      })}
    </S.Masonry>
  );
}

function ContactBoard({
  contacts,
  projectsById,
  selectedContact,
  token,
  onSelect,
  onChanged,
}: {
  readonly contacts: readonly Contact[];
  readonly projectsById: ReadonlyMap<string, ProjectSummary>;
  readonly selectedContact: Contact | null;
  readonly token: string;
  readonly onSelect: (contact: Contact | null) => void;
  readonly onChanged: () => Promise<void>;
}) {
  if (selectedContact) {
    return (
      <S.DetailShell>
        <S.BackButton type="button" onClick={() => onSelect(null)}>‹</S.BackButton>
        <S.DetailTitle>{selectedContact.name ?? '담당자'}</S.DetailTitle>
        <S.DetailPanel>
          <S.DetailLabel>기업정보</S.DetailLabel>
          <S.DetailValue>{selectedContact.organization ?? '-'}</S.DetailValue>
          <S.DetailValue>{projectsById.get(selectedContact.projectId)?.serviceName ?? '-'}</S.DetailValue>
          <S.DetailLabel>담당자정보</S.DetailLabel>
          <S.DetailValue>{selectedContact.name ?? '-'}</S.DetailValue>
          <S.DetailValue>{selectedContact.position ?? '-'}</S.DetailValue>
          <S.DetailValue>{selectedContact.phone ?? '-'}</S.DetailValue>
          <S.DetailValue>{selectedContact.email ?? '-'}</S.DetailValue>
          <S.DetailMemo>{selectedContact.memo ?? ''}</S.DetailMemo>
        </S.DetailPanel>
      </S.DetailShell>
    );
  }
  if (contacts.length === 0) return <S.EmptyState>아직 채용을 희망하는 회사가 없습니다</S.EmptyState>;
  return (
    <S.ContactGrid>
      {contacts.map((contact) => (
        <S.ContactCard
          key={contact.id}
          type="button"
          onClick={async () => {
            onSelect(contact);
            if (contact.status === 'new') {
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

function ProjectBoard({ projects }: { readonly projects: readonly ProjectSummary[] }) {
  return (
    <S.ProjectGrid>
      {projects.map((project) => (
        <S.ProjectCard key={project.id}>
          <S.ProjectChip $color={projectColor(project)}>{project.boothSlot ?? 'Project'}</S.ProjectChip>
          <S.CardTitle>{project.serviceName}</S.CardTitle>
          <S.CardBody>{project.description ?? '설명이 없습니다'}</S.CardBody>
          <S.CardFooter>
            <span>피드백 {project.feedbackCount}</span>
            <span>채용 {project.contactCount}</span>
          </S.CardFooter>
        </S.ProjectCard>
      ))}
    </S.ProjectGrid>
  );
}

function UserBoard({ snapshot }: { readonly snapshot: AdminSnapshot }) {
  return (
    <S.ContactGrid>
      {snapshot.users.items.map((user) => (
        <S.ContactCard key={user.id} type="button">
          <S.CardTitle>{user.name}</S.CardTitle>
          <S.ContactOrg>{user.email}</S.ContactOrg>
          <S.RoleBadge>{user.role}</S.RoleBadge>
        </S.ContactCard>
      ))}
    </S.ContactGrid>
  );
}

async function loadSnapshot(
  token: string,
  setSnapshot: (snapshot: AdminSnapshot | null) => void,
  setStatus: (status: 'loading' | 'ready' | 'error') => void,
  setMessage: (message: string) => void,
): Promise<void> {
  if (!token) {
    setStatus('error');
    setMessage('Mirim OAuth 로그인이 필요합니다');
    return;
  }
  try {
    setStatus('loading');
    setSnapshot(await fetchAdminSnapshot(token));
    setMessage('');
    setStatus('ready');
  } catch (caught) {
    if (!(caught instanceof Error)) throw caught;
    setMessage(caught.message);
    setStatus('error');
  }
}

function sortByDate<T extends { readonly createdAt: string }>(items: readonly T[], sort: SortKey): readonly T[] {
  return [...items].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sort === 'latest' ? diff : -diff;
  });
}

function projectColor(project: ProjectSummary | undefined): string {
  return CATEGORY_COLORS[project?.experienceCategory ?? ''] ?? '#F399BE';
}

function initialOf(name: string): string {
  return name.trim().slice(0, 1) || 'I';
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default AdminDashboard;
