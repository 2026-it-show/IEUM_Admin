import { useState } from 'react';
import { updateFeedbackStatus, type Feedback, type FeedbackStatus, type ProjectSummary } from '../../../api/adminApi';
import { formatDate, projectColor } from '../adminTypes';
import * as S from '../AdminDashboard.styled';

type FeedbackWithProject = Feedback & { readonly project?: ProjectSummary };

type FeedbackListProps = {
  readonly feedback: readonly FeedbackWithProject[];
  readonly token?: string;
  readonly canModerate?: boolean;
};

export function FeedbackList({ feedback, token = '', canModerate = false }: FeedbackListProps) {
  const [statusById, setStatusById] = useState<Record<string, FeedbackStatus | undefined>>({});
  const [pendingById, setPendingById] = useState<Record<string, boolean | undefined>>({});

  if (feedback.length === 0) return <S.EmptyState>아직 받은 피드백이 없습니다</S.EmptyState>;
  return (
    <S.Masonry>
      {feedback.map((item) => {
        const status = statusById[item.id] ?? item.status;
        const nextStatus = status === 'public' ? 'blocked' : 'public';
        return (
          <S.FeedbackCard key={item.id}>
            <S.ProjectChip $color={projectColor(item.project)}>{item.project?.serviceName ?? 'Project'}</S.ProjectChip>
            <S.CardTitle>{item.project?.teamName ?? item.project?.boothSlot ?? '기똥찬 라이언'}</S.CardTitle>
            <S.CardBody>{item.content}</S.CardBody>
            <S.CardFooter>
              <span>{formatDate(item.createdAt)}</span>
              {canModerate ? (
                <S.MiniButton
                  type="button"
                  disabled={Boolean(pendingById[item.id])}
                  onClick={async () => {
                    setPendingById((previous) => ({ ...previous, [item.id]: true }));
                    try {
                      const updated = await updateFeedbackStatus(token, item.id, nextStatus);
                      setStatusById((previous) => ({ ...previous, [item.id]: updated.status }));
                    } finally {
                      setPendingById((previous) => ({ ...previous, [item.id]: false }));
                    }
                  }}
                >
                  {status === 'public' ? '숨김' : '공개'}
                </S.MiniButton>
              ) : null}
            </S.CardFooter>
          </S.FeedbackCard>
        );
      })}
    </S.Masonry>
  );
}
