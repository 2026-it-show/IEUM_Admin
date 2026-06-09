import { updateFeedbackStatus, type Feedback, type ProjectSummary } from '../../../api/adminApi';
import { formatDate, projectColor } from '../adminTypes';
import * as S from '../AdminDashboard.styled';

type FeedbackWithProject = Feedback & { readonly project?: ProjectSummary };

type FeedbackListProps = {
  readonly feedback: readonly FeedbackWithProject[];
  readonly token?: string;
  readonly canModerate?: boolean;
  readonly onChanged?: () => Promise<void>;
};

export function FeedbackList({ feedback, token = '', canModerate = false, onChanged }: FeedbackListProps) {
  if (feedback.length === 0) return <S.EmptyState>아직 받은 피드백이 없습니다</S.EmptyState>;
  return (
    <S.Masonry>
      {feedback.map((item) => (
        <S.FeedbackCard key={item.id}>
          <S.ProjectChip $color={projectColor(item.project)}>{item.project?.serviceName ?? 'Project'}</S.ProjectChip>
          <S.CardTitle>{item.project?.teamName ?? item.project?.boothSlot ?? '기똥찬 라이언'}</S.CardTitle>
          <S.CardBody>{item.content}</S.CardBody>
          <S.CardFooter>
            <span>{formatDate(item.createdAt)}</span>
            {canModerate ? (
              <S.MiniButton
                type="button"
                onClick={async () => {
                  await updateFeedbackStatus(token, item.id, item.status === 'public' ? 'blocked' : 'public');
                  await onChanged?.();
                }}
              >
                {item.status === 'public' ? '숨김' : '공개'}
              </S.MiniButton>
            ) : null}
          </S.CardFooter>
        </S.FeedbackCard>
      ))}
    </S.Masonry>
  );
}
