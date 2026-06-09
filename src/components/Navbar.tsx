import React from 'react';
import styled from 'styled-components';

// 1. Navbar가 받을 프롭스 타입을 먼저 정의합니다.
interface NavbarProps {
  onProfileClick: () => void;
}

// 기존 스타일 컴포넌트들은 그대로 두시면 됩니다.
const NavContainer = styled.nav`
  /* 기존 내비바 스타일 수치 그대로 유지 */
  width: 1920px;
  height: 81px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E5E7;
  z-index: 50;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

// 2. React.FC<NavbarProps> 형태로 타입을 지정하고 온클릭 프롭을 구조 분해 할당으로 받습니다.
const Navbar: React.FC<NavbarProps> = ({ onProfileClick }) => {
  return (
    <NavContainer>
      {/* 로고 영역 */}
      <img src="/assets/figma/header-logo.svg" alt="IEUM" style={{ width: '136px', height: '27px' }} />
      {/* 3. 오른쪽 프로필 버튼이나 이미지에 onClick={onProfileClick}을 달아줍니다. */}
      <ProfileButton onClick={onProfileClick}>
        <img src="/assets/icons/profile_logo.svg" alt="IEUM" style={{ width: "36px", height: '36px' }} />
      </ProfileButton>
    </NavContainer>
  );
};

export default Navbar;
