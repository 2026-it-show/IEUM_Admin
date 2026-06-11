import { useMemo, useState } from 'react';
import {
  createBannedWord,
  deleteBannedWord,
  fetchBannedWords,
  updateBannedWord,
  type AdminSnapshot,
  type BannedWord,
  type CursorPage,
  type ProjectSummary,
} from '../../../api/adminApi';
import { ADMIN_MANAGE_LABELS, projectColor, roleLabel, type AdminManageKey } from '../adminTypes';
import * as S from '../AdminDashboard.styled';

const bannedWordPageSizes = [10, 50, 100, 300] as const;
type BannedWordPageSize = (typeof bannedWordPageSizes)[number];

type AdminManagementProps = {
  readonly snapshot: AdminSnapshot;
  readonly token: string;
  readonly onChanged: () => Promise<void>;
  readonly isPreview?: boolean;
};

export function AdminManagement({ snapshot, token, onChanged, isPreview = false }: AdminManagementProps) {
  const [view, setView] = useState<AdminManageKey>('projects');
  return (
    <S.ManageSection>
      <S.TabGroup aria-label="어드민 관리">
        {(Object.keys(ADMIN_MANAGE_LABELS) as AdminManageKey[]).map((key) => (
          <S.TabButton key={key} type="button" $active={view === key} onClick={() => setView(key)}>
            {ADMIN_MANAGE_LABELS[key]}
          </S.TabButton>
        ))}
      </S.TabGroup>
      {view === 'projects' ? <ProjectBoard projects={snapshot.projects.items} /> : null}
      {view === 'users' ? (
        <S.ContactGrid>
          {snapshot.users.items.map((user) => (
            <S.ContactCard key={user.id} type="button">
              <S.CardTitle>{user.name}</S.CardTitle>
              <S.ContactOrg>{user.email}</S.ContactOrg>
              <S.RoleBadge>{roleLabel(user.role)}</S.RoleBadge>
            </S.ContactCard>
          ))}
        </S.ContactGrid>
      ) : null}
      {view === 'bannedWords' ? <BannedWordBoard initialPage={snapshot.bannedWords} token={token} onChanged={onChanged} isPreview={isPreview} /> : null}
    </S.ManageSection>
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

function BannedWordBoard({
  initialPage,
  token,
  onChanged,
  isPreview,
}: {
  readonly initialPage: CursorPage<BannedWord>;
  readonly token: string;
  readonly onChanged: () => Promise<void>;
  readonly isPreview: boolean;
}) {
  const [word, setWord] = useState('');
  const [page, setPage] = useState<CursorPage<BannedWord>>(initialPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<BannedWordPageSize>(50);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [updatedWords, setUpdatedWords] = useState<ReadonlyMap<string, BannedWord>>(() => new Map());
  const [deletedWordIds, setDeletedWordIds] = useState<ReadonlySet<string>>(() => new Set());

  const localWords = useMemo(
    () => page.items
      .filter((item) => !deletedWordIds.has(item.id))
      .map((item) => updatedWords.get(item.id) ?? item),
    [deletedWordIds, page.items, updatedWords],
  );
  const totalWordCount = page.total ?? localWords.length;
  const activeWordCount = page.activeTotal ?? localWords.filter((item) => item.isActive).length;
  const inactiveWordCount = page.inactiveTotal ?? totalWordCount - activeWordCount;
  const totalPages = Math.max(1, Math.ceil(totalWordCount / pageSize));
  const startIndex = totalWordCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalWordCount, (currentPage - 1) * pageSize + localWords.length);
  const visiblePages = createVisiblePages(currentPage, totalPages);

  const loadPage = async (nextPage: number, nextPageSize = pageSize): Promise<void> => {
    if (isPreview || isPageLoading) return;
    setIsPageLoading(true);
    try {
      const nextPageData = await fetchBannedWords(token, nextPage, nextPageSize);
      setPage(nextPageData);
      setCurrentPage(nextPage);
      setPageSize(nextPageSize);
      setUpdatedWords(new Map());
      setDeletedWordIds(new Set());
    } finally {
      setIsPageLoading(false);
    }
  };

  return (
    <S.ManageSection>
      <S.WordSummary aria-label="금칙어 현황">
        <span>총 {totalWordCount.toLocaleString()}개</span>
        <span>활성 {activeWordCount.toLocaleString()}개</span>
        <span>비활성 {inactiveWordCount.toLocaleString()}개</span>
      </S.WordSummary>
      <S.WordForm
        onSubmit={async (event) => {
          event.preventDefault();
          const trimmed = word.trim();
          if (!trimmed) return;
          if (isPreview) {
            setWord('');
            return;
          }
          await createBannedWord(token, trimmed);
          const firstPage = await fetchBannedWords(token, 1, pageSize);
          setWord('');
          setPage(firstPage);
          setCurrentPage(1);
          setUpdatedWords(new Map());
          setDeletedWordIds(new Set());
          await onChanged();
        }}
      >
        <S.WordInput value={word} onChange={(event) => setWord(event.target.value)} placeholder="금칙어 추가" />
        <S.PrimaryButton type="submit">추가</S.PrimaryButton>
      </S.WordForm>
      <S.PageSizeRow>
        <span>페이지당</span>
        <S.PageSizeSelect
          value={pageSize}
          disabled={isPageLoading}
          onChange={(event) => {
            void loadPage(1, Number(event.target.value) as BannedWordPageSize);
          }}
        >
          {bannedWordPageSizes.map((size) => (
            <option key={size} value={size}>
              {size}개씩 보기
            </option>
          ))}
        </S.PageSizeSelect>
      </S.PageSizeRow>
      <S.ContactGrid>
        {localWords.map((item) => (
          <S.WordCard key={item.id}>
            <S.CardTitle>{item.word}</S.CardTitle>
            <S.ContactOrg>{item.isActive ? '활성' : '비활성'}</S.ContactOrg>
            <S.CardFooter>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  if (isPreview) return;
                  const updated = await updateBannedWord(token, item.id, !item.isActive);
                  setUpdatedWords((current) => new Map(current).set(updated.id, updated));
                }}
              >
                {item.isActive ? '끄기' : '켜기'}
              </S.MiniButton>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  if (isPreview) return;
                  await deleteBannedWord(token, item.id);
                  setDeletedWordIds((current) => new Set(current).add(item.id));
                }}
              >
                삭제
              </S.MiniButton>
            </S.CardFooter>
          </S.WordCard>
        ))}
      </S.ContactGrid>
      <S.PaginationBar aria-label="금칙어 페이지네이션">
        <S.PageButton
          type="button"
          disabled={currentPage === 1 || isPageLoading}
          onClick={() => {
            void loadPage(currentPage - 1);
          }}
        >
          이전
        </S.PageButton>
        {visiblePages.map((item, index) => (
          item === 'ellipsis' ? (
            <S.PageEllipsis key={`ellipsis-${index}`}>...</S.PageEllipsis>
          ) : (
            <S.PageNumberButton
              key={item}
              type="button"
              $active={item === currentPage}
              disabled={isPageLoading}
              onClick={() => {
                void loadPage(item);
              }}
            >
              {item}
            </S.PageNumberButton>
          )
        ))}
        <S.PageInfo>
          {startIndex.toLocaleString()}-{endIndex.toLocaleString()} / {totalWordCount.toLocaleString()}
        </S.PageInfo>
        <S.PageButton
          type="button"
          disabled={currentPage >= totalPages || isPageLoading}
          onClick={() => {
            void loadPage(currentPage + 1);
          }}
        >
          다음
        </S.PageButton>
      </S.PaginationBar>
    </S.ManageSection>
  );
}

function createVisiblePages(currentPage: number, totalPages: number): readonly (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter((page) => page >= 1 && page <= totalPages));
  const sortedPages = [...pages].sort((left, right) => left - right);
  return sortedPages.flatMap((page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage !== undefined && page - previousPage > 1) {
      return ['ellipsis', page] as const;
    }
    return [page] as const;
  });
}
