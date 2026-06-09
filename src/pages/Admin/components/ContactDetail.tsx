import type { Contact, ProjectSummary } from '../../../api/adminApi';
import * as S from '../AdminDashboard.styled';

type ContactDetailProps = {
  readonly contact: Contact;
  readonly project: ProjectSummary | undefined;
  readonly onBack: () => void;
};

export function ContactDetail({ contact, project, onBack }: ContactDetailProps) {
  return (
    <S.DetailShell>
      <S.DetailHeader>
        <S.BackButton type="button" onClick={onBack} aria-label="목록으로 돌아가기">
          ×
        </S.BackButton>
        <S.DetailTitle>{contact.name ?? '담당자'}</S.DetailTitle>
      </S.DetailHeader>
      <S.DetailPanel>
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
    </S.DetailShell>
  );
}
