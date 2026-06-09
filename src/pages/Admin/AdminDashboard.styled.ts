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
  z-index: 20;
  height: 81px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(18px, 2.2vw, 42px);
  background: #ffffff;
  box-shadow: 0 2px 5.6px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.img`
  width: 136px;
  height: 27px;
  object-fit: contain;
`;

export const ProfileButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: #ececec;
  color: #443481;
  font-size: 18px;
  display: grid;
  place-items: center;

  &:disabled {
    cursor: wait;
  }
`;

export const ProfileCard = styled.aside`
  position: absolute;
  top: 91px;
  right: clamp(18px, 2vw, 29px);
  width: min(calc(100vw - 36px), 271px);
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

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f2f5cc;
  color: #443481;
  font-size: 24px;
`;

export const ProfileName = styled.p`
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
  display: block;
  color: #333333;
  font-size: 20px;
`;

export const Content = styled.main`
  width: min(calc(100% - 48px), 1404px);
  margin: 0 auto;
  padding: clamp(28px, 4.7vw, 51px) 0 56px;

  @media (max-width: 720px) {
    width: min(calc(100% - 28px), 1404px);
    padding-top: 22px;
  }
`;

export const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const StatCard = styled.article`
  min-height: 96px;
  padding: 20px 24px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #ffffff;

  span {
    display: block;
    color: #666666;
    font-size: 15px;
    line-height: 1.45;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: #222222;
    font-size: clamp(28px, 4vw, 38px);
    line-height: 1;
    font-weight: 500;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
`;

export const TabGroup = styled.nav`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    gap: 8px;
  }
`;

export const TabButton = styled.button<{ readonly $active: boolean }>`
  min-width: 107px;
  height: 46px;
  padding: 0 34px;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? '#e74e5b' : '#f5f5f5')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#000000')};
  font-size: 20px;
  white-space: nowrap;

  @media (max-width: 520px) {
    min-width: 0;
    flex: 1 1 calc(50% - 8px);
    padding: 0 14px;
    font-size: 16px;
  }
`;

export const SortSelect = styled.select`
  height: 50px;
  min-width: 147px;
  padding: 0 23px;
  border: 1px solid #d9d9d9;
  border-radius: 31px;
  background: #ffffff;
  color: #000000;
  font-size: 20px;

  @media (max-width: 720px) {
    width: 100%;
  }
`;

export const Masonry = styled.section`
  column-count: 4;
  column-gap: 20px;

  @media (max-width: 1200px) {
    column-count: 2;
  }

  @media (max-width: 720px) {
    column-count: 1;
  }
`;

export const FeedbackCard = styled.article`
  display: inline-block;
  width: 100%;
  margin: 0 0 20px;
  padding: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #ffffff;
  break-inside: avoid;
`;

export const ProjectGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectCard = styled.article`
  min-height: 236px;
  padding: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #ffffff;
`;

export const ProjectChip = styled.span<{ readonly $color: string }>`
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 15px;
  border-radius: 25px;
  background: ${({ $color }) => $color};
  color: #222222;
  font-size: 16px;
  line-height: 30px;
`;

export const CardTitle = styled.h2`
  margin-top: 20px;
  color: #222222;
  font-size: 24px;
  line-height: 30px;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const CardBody = styled.p`
  margin-top: 20px;
  color: #444444;
  font-size: 16px;
  line-height: 30px;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const CardFooter = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  color: #666666;
  font-size: 13px;
`;

export const MiniButton = styled.button`
  min-height: 32px;
  padding: 0 12px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #222222;
`;

export const ContactGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactCard = styled.button`
  position: relative;
  min-height: 120px;
  padding: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #ffffff;
  text-align: left;
  transition: box-shadow 120ms ease;

  &:hover {
    box-shadow: 0 4px 5.2px rgba(0, 0, 0, 0.15);
  }
`;

export const ContactOrg = styled.p`
  margin-top: 10px;
  color: #444444;
  font-size: 16px;
  line-height: 30px;
  overflow-wrap: anywhere;
`;

export const NewDot = styled.span`
  position: absolute;
  top: 29px;
  right: 29px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e74e5b;
`;

export const RoleBadge = styled.span`
  position: absolute;
  right: 25px;
  bottom: 20px;
  color: #e74e5b;
  font-size: 14px;
`;

export const DetailShell = styled.section`
  position: relative;
  min-height: 720px;
  padding-top: 14px;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 250px;
  left: 0;
  color: #222222;
  font-size: 54px;
  line-height: 54px;

  @media (max-width: 720px) {
    position: static;
    margin-bottom: 14px;
    font-size: 42px;
    line-height: 42px;
  }
`;

export const DetailTitle = styled.h1`
  margin-left: 79px;
  color: #222222;
  font-size: 32px;
  line-height: 35px;
  font-weight: 500;

  @media (max-width: 720px) {
    margin-left: 0;
    font-size: 26px;
  }
`;

export const DetailPanel = styled.div`
  width: min(calc(100% - 128px), 1246px);
  min-height: 672px;
  margin: 58px auto 0;
  padding: clamp(32px, 6vw, 85px) clamp(22px, 7vw, 114px);
  border-radius: 24px;
  background: #eeeeee;
  display: grid;
  grid-template-columns: minmax(120px, 180px) minmax(0, 1fr);
  gap: 16px 33px;
  align-content: start;

  @media (max-width: 720px) {
    width: 100%;
    min-height: 0;
    margin-top: 22px;
    grid-template-columns: 1fr;
  }
`;

export const DetailLabel = styled.h2`
  color: #000000;
  font-size: 24px;
  line-height: 55px;
  font-weight: 500;
`;

export const DetailValue = styled.p`
  min-height: 55px;
  padding: 10px 15px;
  border-radius: 12px;
  background: #ffffff;
  color: #444444;
  font-size: 20px;
  line-height: 35px;
  overflow-wrap: anywhere;
`;

export const DetailMemo = styled.p`
  grid-column: 2;
  min-height: 110px;
  padding: 10px 15px;
  border-radius: 12px;
  background: #ffffff;
  color: #444444;
  font-size: 20px;
  line-height: 35px;
  overflow-wrap: anywhere;

  @media (max-width: 720px) {
    grid-column: auto;
  }
`;

export const Stack = styled.div`
  display: grid;
  gap: 20px;
`;

export const WordForm = styled.form`
  display: flex;
  gap: 12px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const WordInput = styled.input`
  min-height: 46px;
  flex: 1;
  min-width: 0;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  padding: 0 16px;
`;

export const EmptyState = styled.div`
  min-height: 420px;
  display: grid;
  place-items: center;
  color: #b7b7b7;
  font-size: clamp(20px, 4vw, 32px);
  text-align: center;
`;

export const Notice = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff4bf;
  color: #6c5715;
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

export const SkeletonCard = styled.div`
  min-height: 96px;
  border-radius: 24px;
  background: ${skeletonGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const SkeletonTabs = styled.div`
  width: min(100%, 595px);
  height: 46px;
  border-radius: 12px;
  background: ${skeletonGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const SkeletonSelect = styled.div`
  width: 147px;
  height: 50px;
  border-radius: 31px;
  background: ${skeletonGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;

  @media (max-width: 720px) {
    width: 100%;
  }
`;

export const SkeletonPanel = styled.div`
  min-height: 236px;
  border-radius: 24px;
  background: ${skeletonGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;
