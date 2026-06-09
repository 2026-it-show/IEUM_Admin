import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createBannedWord,
  deleteBannedWord,
  fetchAdminSnapshot,
  fetchContactDetail,
  logout,
  readStoredToken,
  updateBannedWord,
  updateContactStatus,
  updateFeedbackStatus,
  type AdminSnapshot,
  type BannedWord,
  type Contact,
  type Feedback,
  type ProjectSummary,
} from '../../api/adminApi';
import * as S from './AdminDashboard.styled';

type ViewKey = 'feedback' | 'contacts' | 'projects' | 'users' | 'bannedWords';
type SortKey = 'latest' | 'oldest';
type LoadStatus = 'loading' | 'ready' | 'error';

const VIEW_LABELS: Record<ViewKey, string> = {
  feedback: '피드백',
  contacts: '채용',
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

function AdminDashboard() {
  const token = useMemo(() => readStoredToken(), []);
  const [view, setView] = useState<ViewKey>('feedback');
  const [sort, setSort] = useState<SortKey>('latest');
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    await loadSnapshot(token, setSnapshot, setStatus, setMessage);
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

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
        <S.Logo src="/assets/brand/ieum-header-logo.svg" alt="IEUM" />
        <S.ProfileButton type="button" onClick={() => setProfileOpen((open) => !open)} aria-label="프로필">
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
              onClick={async () => {
                await logout(token).catch(() => undefined);
                window.location.assign('/');
              }}
            >
              로그아웃
            </S.LogoutButton>
          </S.ProfileCard>
        ) : null}
      </S.Topbar>

      <S.Content>
        <S.StatsGrid aria-label="관리자 통계">
          <S.StatCard>
            <span>프로젝트</span>
            <strong>{snapshot.dashboard.projectCount}</strong>
          </S.StatCard>
          <S.StatCard>
            <span>피드백</span>
            <strong>{snapshot.dashboard.feedbackCount}</strong>
          </S.StatCard>
          <S.StatCard>
            <span>채용 문의</span>
            <strong>{snapshot.dashboard.contactCount}</strong>
          </S.StatCard>
          <S.StatCard>
            <span>관심 표시</span>
            <strong>{snapshot.dashboard.interestCount}</strong>
          </S.StatCard>
        </S.StatsGrid>

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
          <FeedbackBoard feedback={sortedFeedback} projectsById={projectsById} token={token} onChanged={refresh} />
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
        {view === 'bannedWords' ? <BannedWordBoard words={snapshot.bannedWords.items} token={token} onChanged={refresh} /> : null}
      </S.Content>
    </S.Page>
  );
}

function DashboardSkeleton() {
  return (
    <S.Page>
      <S.Topbar>
        <S.Logo src="/assets/brand/ieum-header-logo.svg" alt="IEUM" />
        <S.ProfileButton type="button" aria-label="프로필" disabled />
      </S.Topbar>
      <S.Content>
        <S.StatsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <S.SkeletonCard key={index} />
          ))}
        </S.StatsGrid>
        <S.Toolbar>
          <S.SkeletonTabs />
          <S.SkeletonSelect />
        </S.Toolbar>
        <S.ProjectGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <S.SkeletonPanel key={index} />
          ))}
        </S.ProjectGrid>
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
            <S.ProjectChip $color={projectColor(project)}>{project?.boothSlot ?? project?.serviceName ?? 'Project'}</S.ProjectChip>
            <S.CardTitle>{project?.serviceName ?? '프로젝트'}</S.CardTitle>
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
    return <ContactDetail contact={selectedContact} project={projectsById.get(selectedContact.projectId)} onBack={() => onSelect(null)} />;
  }
  if (contacts.length === 0) return <S.EmptyState>아직 채용을 희망하는 회사가 없습니다</S.EmptyState>;
  return (
    <S.ContactGrid>
      {contacts.map((contact) => (
        <S.ContactCard
          key={contact.id}
          type="button"
          onClick={async () => {
            const detail = await fetchContactDetail(token, contact.id).catch(() => contact);
            onSelect(detail);
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

function ContactDetail({
  contact,
  project,
  onBack,
}: {
  readonly contact: Contact;
  readonly project: ProjectSummary | undefined;
  readonly onBack: () => void;
}) {
  return (
    <S.DetailShell>
      <S.BackButton type="button" onClick={onBack} aria-label="목록으로 돌아가기">
        ‹
      </S.BackButton>
      <S.DetailTitle>{contact.name ?? '담당자'}</S.DetailTitle>
      <S.DetailPanel>
        <S.DetailLabel>기업정보</S.DetailLabel>
        <S.DetailValue>{contact.organization ?? '-'}</S.DetailValue>
        <S.DetailValue>{project?.serviceName ?? '-'}</S.DetailValue>
        <S.DetailLabel>담당자정보</S.DetailLabel>
        <S.DetailValue>{contact.name ?? '-'}</S.DetailValue>
        <S.DetailValue>{contact.position ?? '-'}</S.DetailValue>
        <S.DetailValue>{contact.phone ?? '-'}</S.DetailValue>
        <S.DetailValue>{contact.email ?? '-'}</S.DetailValue>
        <S.DetailMemo>{contact.memo ?? '메모가 없습니다'}</S.DetailMemo>
      </S.DetailPanel>
    </S.DetailShell>
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
            <span>관심 {project.interestCount ?? 0}</span>
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

function BannedWordBoard({
  words,
  token,
  onChanged,
}: {
  readonly words: readonly BannedWord[];
  readonly token: string;
  readonly onChanged: () => Promise<void>;
}) {
  const [word, setWord] = useState('');
  return (
    <S.Stack>
      <S.WordForm
        onSubmit={async (event) => {
          event.preventDefault();
          const trimmed = word.trim();
          if (!trimmed) return;
          await createBannedWord(token, trimmed);
          setWord('');
          await onChanged();
        }}
      >
        <S.WordInput value={word} onChange={(event) => setWord(event.target.value)} placeholder="금칙어 추가" />
        <S.PrimaryButton type="submit">추가</S.PrimaryButton>
      </S.WordForm>
      <S.ContactGrid>
        {words.map((item) => (
          <S.ContactCard key={item.id} type="button">
            <S.CardTitle>{item.word}</S.CardTitle>
            <S.ContactOrg>{item.isActive ? '활성' : '비활성'}</S.ContactOrg>
            <S.CardFooter>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  await updateBannedWord(token, item.id, !item.isActive);
                  await onChanged();
                }}
              >
                {item.isActive ? '끄기' : '켜기'}
              </S.MiniButton>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  await deleteBannedWord(token, item.id);
                  await onChanged();
                }}
              >
                삭제
              </S.MiniButton>
            </S.CardFooter>
          </S.ContactCard>
        ))}
      </S.ContactGrid>
    </S.Stack>
  );
}

async function loadSnapshot(
  token: string,
  setSnapshot: (snapshot: AdminSnapshot | null) => void,
  setStatus: (status: LoadStatus) => void,
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
