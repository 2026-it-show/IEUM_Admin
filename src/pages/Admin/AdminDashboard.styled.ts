import styled from 'styled-components';

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
  padding: 0 42px;
  background: #ffffff;
  box-shadow: 0 2px 5.6px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.img`
  width: 136px;
  height: 27px;
`;

export const ProfileButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: #ececec;
  color: #443481;
  font-size: 18px;
`;

export const ProfileCard = styled.aside`
  position: absolute;
  top: 91px;
  right: 29px;
  width: 271px;
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
  width: min(100% - 80px, 1404px);
  margin: 0 auto;
  padding: 51px 0 56px;

  @media (max-width: 720px) {
    width: min(100% - 32px, 1404px);
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const TabGroup = styled.nav`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ readonly $active: boolean }>`
  min-width: 107px;
  height: 46px;
  padding: 0 34px;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? '#e74e5b' : '#f5f5f5')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#000000')};
  font-size: 20px;
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
`;

export const CardBody = styled.p`
  margin-top: 20px;
  color: #444444;
  font-size: 16px;
  line-height: 30px;
  word-break: keep-all;
`;

export const CardFooter = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  min-height: 780px;
  padding-top: 14px;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 250px;
  left: 27px;
  color: #222222;
  font-size: 54px;
  line-height: 54px;
`;

export const DetailTitle = styled.h1`
  margin-left: 79px;
  color: #222222;
  font-size: 32px;
  line-height: 35px;
  font-weight: 500;
`;

export const DetailPanel = styled.div`
  width: min(100% - 160px, 1246px);
  min-height: 672px;
  margin: 58px auto 0;
  padding: 85px 114px;
  border-radius: 24px;
  background: #eeeeee;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px 33px;
  align-content: start;
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
`;

export const EmptyState = styled.div`
  min-height: 620px;
  display: grid;
  place-items: center;
  color: #d9d9d9;
  font-size: 32px;
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
