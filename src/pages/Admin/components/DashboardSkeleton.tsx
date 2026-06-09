import * as S from '../AdminDashboard.styled';

export function DashboardSkeleton() {
  return (
    <S.Page>
      <S.Topbar>
        <S.HeaderLogo src="/assets/brand/ieum-header-logo.png" alt="IEUM" />
        <S.ProfileButton type="button" aria-label="프로필" disabled>
          <S.ProfileAvatar />
        </S.ProfileButton>
      </S.Topbar>
      <S.Content>
        <S.Desk>
          <S.SearchRow>
            <S.SkeletonBlock style={{ width: 'min(100%, 840px)', height: 60, borderRadius: 49 }} />
            <S.SkeletonBlock style={{ width: 147, height: 50, borderRadius: 31 }} />
          </S.SearchRow>
          <S.SkeletonBlock style={{ width: 'min(100%, 626px)', height: 46, borderRadius: 12 }} />
          <S.ContactGrid>
            {Array.from({ length: 8 }).map((_, index) => (
              <S.SkeletonBlock key={index} style={{ minHeight: 120 }} />
            ))}
          </S.ContactGrid>
        </S.Desk>
      </S.Content>
    </S.Page>
  );
}
