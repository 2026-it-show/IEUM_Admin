import { useRef } from 'react';
import type { Contact, ProjectSummary } from '../../../api/adminApi';
import * as S from '../AdminDashboard.styled';

type ContactDetailProps = {
  readonly contact: Contact;
  readonly project: ProjectSummary | undefined;
  readonly currentIndex: number;
  readonly totalCount: number;
  readonly onBack: () => void;
  readonly onMove: (direction: -1 | 1) => void;
  readonly onSelectIndex: (index: number) => void;
};

const SWIPE_THRESHOLD_PX = 42;

export function ContactDetail({
  contact,
  project,
  currentIndex,
  totalCount,
  onBack,
  onMove,
  onSelectIndex,
}: ContactDetailProps) {
  const dragStartX = useRef<number | null>(null);
  const canMove = totalCount > 1;

  const handleDragEnd = (clientX: number) => {
    const startX = dragStartX.current;
    dragStartX.current = null;
    if (startX === null || !canMove) return;
    const distance = clientX - startX;
    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return;
    onMove(distance < 0 ? 1 : -1);
  };

  return (
    <S.DetailShell>
      <S.DetailHeader>
        <S.BackButton type="button" onClick={onBack} aria-label="목록으로 돌아가기">
          ×
        </S.BackButton>
        <S.DetailTitle>{contact.name ?? '담당자'}</S.DetailTitle>
      </S.DetailHeader>
      <S.DetailCarousel>
        {canMove ? (
          <S.DetailArrow type="button" $direction="left" onClick={() => onMove(-1)} aria-label="이전 채용희망 보기" />
        ) : null}
        <S.DetailPanel
          onPointerDown={(event) => {
            dragStartX.current = event.clientX;
          }}
          onPointerUp={(event) => handleDragEnd(event.clientX)}
          onPointerCancel={() => {
            dragStartX.current = null;
          }}
        >
          <S.DetailLabel>기업정보</S.DetailLabel>
          <S.DetailValues>
            <S.DetailValue>{contact.organization ?? '-'}</S.DetailValue>
            <S.DetailValue>{project?.serviceName ?? '-'}</S.DetailValue>
          </S.DetailValues>
          <S.DetailLabel>담당자정보</S.DetailLabel>
          <S.DetailValues>
            <S.DetailValue>{contact.name ?? '-'}</S.DetailValue>
            <S.DetailValue>{contact.position ?? '-'}</S.DetailValue>
            <S.DetailValue>{contact.phone ?? '-'}</S.DetailValue>
            <S.DetailValue>{contact.email ?? '-'}</S.DetailValue>
          </S.DetailValues>
        </S.DetailPanel>
        {canMove ? (
          <S.DetailArrow type="button" $direction="right" onClick={() => onMove(1)} aria-label="다음 채용희망 보기" />
        ) : null}
      </S.DetailCarousel>
      {canMove ? (
        <S.DetailIndicators aria-label="채용희망 위치">
          {Array.from({ length: totalCount }, (_, index) => (
            <S.DetailIndicator
              key={index}
              type="button"
              $active={index === currentIndex}
              onClick={() => onSelectIndex(index)}
              aria-label={`${index + 1}번째 채용희망 보기`}
            />
          ))}
        </S.DetailIndicators>
      ) : null}
    </S.DetailShell>
  );
}
