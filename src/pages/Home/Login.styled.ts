import styled from 'styled-components';

export const OuterContainer = styled.div`
  min-height: 100dvh;
  background: linear-gradient(134.188deg, #f25c69 2.1959%, #cd3f4b 97.804%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: clamp(28px, 8dvh, 96px) clamp(18px, 5vw, 48px);

  @media (min-width: 901px) {
    overflow: hidden;
    padding: 0;
  }
`;

export const LoginContent = styled.main`
  width: min(100%, 990px);
  min-height: min(720px, calc(100dvh - clamp(56px, 16dvh, 192px)));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(28px, 8dvh, 128px);

  @media (min-width: 901px) {
    position: relative;
    width: 100%;
    min-height: 100dvh;
    justify-content: flex-start;
    gap: 0;
  }

  @media (max-width: 720px) {
    min-height: calc(100dvh - 56px);
    justify-content: center;
    gap: clamp(22px, 7dvh, 64px);
  }
`;

export const LogoWrapper = styled.div`
  width: min(100%, 990px);
  display: flex;
  justify-content: center;

  @media (min-width: 901px) {
    position: absolute;
    top: 246px;
    left: 50%;
    width: 990px;
    height: 90px;
    transform: translateX(-50%);
  }
`;

export const Logo = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;

  @media (max-width: 720px) {
    width: min(100%, 560px);
  }
`;

export const LoginActions = styled.div`
  width: min(100%, 679px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  @media (min-width: 901px) {
    position: absolute;
    top: calc(50% + 147px);
    left: 50%;
    width: 679px;
    transform: translateX(-50%);
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  min-height: clamp(68px, 9vw, 106px);
  padding: 10px clamp(24px, 5vw, 70px);
  border-radius: 71px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 4vw, 50px);
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  @media (min-width: 901px) {
    height: 106px;
    min-height: 106px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.75;
  }

  @media (max-width: 520px) {
    justify-content: flex-start;
  }
`;

export const MirimLogo = styled.img`
  width: clamp(48px, 11vw, 74px);
  height: clamp(48px, 11vw, 74px);
  border-radius: 84px;
  object-fit: cover;
`;

export const ButtonText = styled.span`
  min-width: 0;
  flex: 1;
  font-size: clamp(19px, 4vw, 32px);
  font-weight: 500;
  color: #000000;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 420px) {
    font-size: 18px;
  }
`;

export const Description = styled.p`
  margin: 0;
  width: min(100%, 560px);
  font-size: clamp(16px, 3vw, 24px);
  color: #fab8be;
  text-align: center;
  line-height: 1.65;
  font-weight: 400;

  @media (min-width: 901px) {
    position: absolute;
    top: calc(50% + 371px);
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const TokenPanel = styled.form`
  display: grid;
  gap: 10px;
`;

export const TokenInput = styled.input`
  width: 100%;
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.94);
  padding: 0 14px;
`;

export const ErrorText = styled.p`
  min-height: 24px;
  margin: 0;
  color: #ffffff;
  text-align: center;
  line-height: 1.5;
`;
