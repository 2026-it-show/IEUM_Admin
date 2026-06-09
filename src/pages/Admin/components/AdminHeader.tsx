import { logout, type HomeSnapshot } from '../../../api/adminApi';
import { roleLabel } from '../adminTypes';
import * as S from '../AdminDashboard.styled';

const profileAvatarSrc = '/assets/icons/profile-avatar.png';

type AdminHeaderProps = {
  readonly user: HomeSnapshot['user'];
  readonly token: string;
  readonly profileOpen: boolean;
  readonly setProfileOpen: (open: boolean) => void;
  readonly navigateLogin: () => void;
};

export function AdminHeader({ user, token, profileOpen, setProfileOpen, navigateLogin }: AdminHeaderProps) {
  const profileImageSrc = user.profileImageUrl ?? profileAvatarSrc;

  return (
    <S.Topbar>
      <S.HeaderLogo src="/assets/brand/ieum-header-logo.png" alt="IEUM" />
      <S.ProfileButton type="button" onClick={() => setProfileOpen(!profileOpen)} aria-label="프로필">
        <S.ProfileAvatar>
          <img src={profileImageSrc} alt="" aria-hidden="true" />
        </S.ProfileAvatar>
      </S.ProfileButton>
      {profileOpen ? (
        <S.ProfileCard>
          <S.ProfileRow>
            <S.LargeAvatar src={profileImageSrc} alt="" aria-hidden="true" />
            <div>
              <S.ProfileName>{user.name}</S.ProfileName>
              <S.ProfileEmail>{user.email}</S.ProfileEmail>
              <S.ProfileEmail>{roleLabel(user.role)}</S.ProfileEmail>
            </div>
          </S.ProfileRow>
          <S.LogoutButton
            type="button"
            onClick={async () => {
              await logout(token).catch(() => undefined);
              navigateLogin();
            }}
          >
            <span>로그아웃</span>
            <S.LogoutIcon src="/assets/icons/logout.svg" alt="" aria-hidden="true" />
          </S.LogoutButton>
        </S.ProfileCard>
      ) : null}
    </S.Topbar>
  );
}
