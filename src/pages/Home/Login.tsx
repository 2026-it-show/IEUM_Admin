import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 


const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F25C69, #CD3F4B);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const InnerCanvas = styled.div`
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  transform-origin: center center; 
  
  /* 3. transition 속성을 완전히 제거하여 그 어떤 애니메이션도 작동하지 않게 만듭니다. */
`;

const LogoWrapper = styled.div`
  margin-top: 246px; 
  width: 990px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const LoginButton = styled.button`
  width: 679px;       
  height: 106px;
  border-radius: 71px; 
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  margin-top: 250px;   
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const GoogleIcon = styled.svg`
  margin-right: 20px;
`;

const ButtonText = styled.span`
  font-size: 32px; 
  font-weight: 500;
  color: #000000;
`;

const Description = styled.p`
  font-size: 24px;   
  color: #FAB8BE;
  text-align: center;
  margin-top: 45px;
  line-height: 1.6;
  font-weight: 400; 
`;

const Login: React.FC = () => {
  const navigate = useNavigate(); 

  // 1. 초기값 선언할 때 브라우저 창 크기를 즉시 계산
  const [scale, setScale] = useState(() => {
    const widthScale = window.innerWidth / 1920;
    const heightScale = window.innerHeight / 1080;
    const minScale = Math.min(widthScale, heightScale);
    return minScale > 1 ? 1 : minScale;
  });

  // 2. 창 크기를 '조절할 때만' 비율을 업데이트
  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / 1920;
      const heightScale = window.innerHeight / 1080;
      const minScale = Math.min(widthScale, heightScale);
      setScale(minScale > 1 ? 1 : minScale);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoogleLogin = () => {
    navigate('/student/home');
  };

  return (
    <OuterContainer>
      <InnerCanvas style={{ transform: `scale(${scale})` }}>
        <LogoWrapper>
          <Logo src="/assets/home_logo.svg" alt="IEUM Logo" />
        </LogoWrapper>

        <LoginButton onClick={handleGoogleLogin}>
          <GoogleIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="40px"
            height="40px"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.07h12.75c-.53 2.87-2.13 5.31-4.51 6.92l7.05 5.47C43.43 36.19 46.5 30.71 46.5 24z" />
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.05-5.47c-1.99 1.34-4.53 2.15-7.44 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </GoogleIcon>
          <ButtonText>Continue with Google</ButtonText>
        </LoginButton>

        <Description>
          미림마이스터고 선생님과 학생들만 이용할 수 있는
          <br />
          IEUM의 관리자 페이지입니다
        </Description>
      </InnerCanvas>
    </OuterContainer>
  );
};

export default Login;