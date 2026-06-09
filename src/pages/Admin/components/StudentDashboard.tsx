import { type Feedback, type ProjectSummary, type StudentSnapshot } from '../../../api/adminApi';
import { sortByDate, type SortKey } from '../adminTypes';
import { FeedbackList } from './FeedbackList';
import * as S from '../AdminDashboard.styled';

type StudentDashboardProps = {
  readonly snapshot: StudentSnapshot;
  readonly projectId: string;
  readonly setProjectId: (projectId: string) => void;
  readonly sort: SortKey;
  readonly setSort: (sort: SortKey) => void;
};

export function StudentDashboard({ snapshot, projectId, setProjectId, sort, setSort }: StudentDashboardProps) {
  const selected = snapshot.projectFeedback.filter((entry) => projectId === 'all' || entry.project.id === projectId);
  const feedback = sortByDate(
    selected.flatMap((entry) => entry.feedback.items.map((item) => withProject(item, entry.project))),
    sort,
  );

  return (
    <S.Content>
      <S.Desk>
        <S.ActionStrip>
          <S.TabGroup aria-label="프로젝트 필터">
            <S.TabButton type="button" $active={projectId === 'all'} onClick={() => setProjectId('all')}>
              전체
            </S.TabButton>
            {snapshot.projects.map((project) => (
              <S.TabButton key={project.id} type="button" $active={projectId === project.id} onClick={() => setProjectId(project.id)}>
                {project.serviceName}
              </S.TabButton>
            ))}
          </S.TabGroup>
          <S.SortSelect value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="정렬">
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </S.SortSelect>
        </S.ActionStrip>
        <FeedbackList feedback={feedback} />
      </S.Desk>
    </S.Content>
  );
}

function withProject(item: Feedback, project: ProjectSummary): Feedback & { readonly project: ProjectSummary } {
  return { ...item, project };
}
