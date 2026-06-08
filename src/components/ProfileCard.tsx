import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 지정된 사이즈 271px * 148px 준수
const CardContainer = styled.div`
  width: 271px;
  height: 148px;
  background-color: #FFFFFF;
  border: 1px solid #E5E5E7;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  padding: 20px 22px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 90px;
  right: 40px; 
  z-index: 100;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const AvatarCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #D2E3FC; /* 부드러운 블루 계열 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #1F1F1F;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #666666;
  margin-top: 2px;
`;


const LogoutButton = styled.button`
  background: none;
  border: none;
  padding: 23px 0 21px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-end;
  color: #1F1F1F;
  font-size: 20px;
  font-weight: 500;
  
  &:hover {
    opacity: 0.7;
  }
`;

interface ProfileCardProps {
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    navigate('/'); // 로그아웃 클릭 시 메인(/)으로 이동
  };

  return (
    <CardContainer>
      <UserInfoSection>
        <AvatarCircle>
          {/* 기본 프로필 아이콘 SVG */}
            <img src="/assets/icons/profile_logo.svg" alt="IEUM" style={{ width: '64px', height: '64px' }} /> 
        </AvatarCircle>
        <TextGroup>
          <UserName>3515 정지영</UserName>
          <UserEmail>d2416@e-mirim.hs.kr</UserEmail>
        </TextGroup>
      </UserInfoSection>
      
      <LogoutButton onClick={handleLogout}>
        <span>로그아웃</span>
        {/* 로그아웃 나가는 모양 SVG 아이콘 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 16L21 12M21 12L17 8M21 12H9M13 16V17C13 18.1046 12.1046 19 11 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H11C12.1046 5 13 5.89543 13 7V8" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </LogoutButton>
    </CardContainer>
  );
};

export default ProfileCard;