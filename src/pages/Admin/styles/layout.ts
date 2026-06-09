import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

const skeletonGradient = 'linear-gradient(90deg, #f4f4f4 0%, #ececec 45%, #f4f4f4 90%)';

export const Page = styled.div`
  min-height: 100dvh;
  background: #ffffff;
  color: #222222;
`;

export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  height: 81px;
  background: #ffffff;
  box-shadow: 0 2px 5.6px rgba(0, 0, 0, 0.1);
`;

export const HeaderLogo = styled.img`
  position: absolute;
  left: clamp(22px, 2.1875vw, 42px);
  top: 27px;
  width: 136px;
  height: 27px;
  object-fit: contain;
`;

export const ProfileButton = styled.button`
  position: absolute;
  top: 16px;
  right: clamp(16px, 1.51vw, 29px);
  width: 50px;
  height: 50px;
  padding: 10px;

  &:disabled {
    cursor: wait;
  }
`;

export const ProfileAvatar = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  overflow: hidden;
  background: #ececec;

  img {
    width: 100%;
    height: 100%;
  }
`;

export const ProfileCard = styled.aside`
  position: absolute;
  top: 91px;
  right: clamp(16px, 1.51vw, 29px);
  width: min(calc(100vw - 32px), 271px);
  min-height: 148px;
  padding: 15px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 39.9px rgba(0, 0, 0, 0.1);
`;

export const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

export const LargeAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex: 0 0 auto;
`;

export const ProfileName = styled.p`
  color: #222222;
  font-size: 20px;
  line-height: 1.5;
`;

export const ProfileEmail = styled.p`
  max-width: 145px;
  color: #666666;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
`;

export const LogoutButton = styled.button`
  margin: 22px 18px 0 auto;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #333333;
  font-size: 20px;
`;

export const LogoutIcon = styled.img`
  width: 28px;
  height: 28px;
`;

export const Content = styled.main`
  width: min(calc(100% - 48px), 1404px);
  margin: 0 auto;
  padding: 51px 0 72px;

  @media (max-width: 900px) {
    width: min(calc(100% - 28px), 1404px);
    padding: 28px 0 48px;
  }
`;

export const Center = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 16px;
  background: #ffffff;
  padding: 24px;
  text-align: center;
`;

export const ErrorText = styled.p`
  color: #e74e5b;
  font-size: 20px;
`;

export const PrimaryButton = styled.button`
  min-height: 46px;
  padding: 0 34px;
  border-radius: 12px;
  background: #e74e5b;
  color: #ffffff;
  font-size: 20px;
`;

export const SkeletonBlock = styled.div`
  border-radius: 24px;
  background: ${skeletonGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;
