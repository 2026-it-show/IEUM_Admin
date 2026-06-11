import { useEffect, useState } from 'react';
import {
  createBannedWord,
  deleteBannedWord,
  updateBannedWord,
  type AdminSnapshot,
  type BannedWord,
  type ProjectSummary,
} from '../../../api/adminApi';
import { ADMIN_MANAGE_LABELS, projectColor, roleLabel, type AdminManageKey } from '../adminTypes';
import * as S from '../AdminDashboard.styled';

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
      {view === 'bannedWords' ? <BannedWordBoard words={snapshot.bannedWords.items} token={token} onChanged={onChanged} isPreview={isPreview} /> : null}
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
  words,
  token,
  onChanged,
  isPreview,
}: {
  readonly words: readonly BannedWord[];
  readonly token: string;
  readonly onChanged: () => Promise<void>;
  readonly isPreview: boolean;
}) {
  const [word, setWord] = useState('');
  const [localWords, setLocalWords] = useState<readonly BannedWord[]>(words);

  useEffect(() => {
    setLocalWords(words);
  }, [words]);

  return (
    <S.ManageSection>
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
          setWord('');
          await onChanged();
        }}
      >
        <S.WordInput value={word} onChange={(event) => setWord(event.target.value)} placeholder="금칙어 추가" />
        <S.PrimaryButton type="submit">추가</S.PrimaryButton>
      </S.WordForm>
      <S.ContactGrid>
        {localWords.map((item) => (
          <S.ContactCard key={item.id} type="button">
            <S.CardTitle>{item.word}</S.CardTitle>
            <S.ContactOrg>{item.isActive ? '활성' : '비활성'}</S.ContactOrg>
            <S.CardFooter>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  if (isPreview) return;
                  const updated = await updateBannedWord(token, item.id, !item.isActive);
                  setLocalWords((current) => current.map((wordItem) => (wordItem.id === updated.id ? updated : wordItem)));
                }}
              >
                {item.isActive ? '끄기' : '켜기'}
              </S.MiniButton>
              <S.MiniButton
                type="button"
                onClick={async () => {
                  if (isPreview) return;
                  await deleteBannedWord(token, item.id);
                  setLocalWords((current) => current.filter((wordItem) => wordItem.id !== item.id));
                }}
              >
                삭제
              </S.MiniButton>
            </S.CardFooter>
          </S.ContactCard>
        ))}
      </S.ContactGrid>
    </S.ManageSection>
  );
}
