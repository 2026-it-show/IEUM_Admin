import { useMirimOAuth } from 'mirim-oauth-react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loginWithMirimToken } from '../../api/adminApi';

const OuterContainer = styled.div`
  min-height: 100dvh;
  background: linear-gradient(134.188deg, #f25c69 2.1959%, #cd3f4b 97.804%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: clamp(28px, 8dvh, 96px) clamp(18px, 5vw, 48px);
`;

const LoginContent = styled.main`
  width: min(100%, 990px);
  min-height: min(720px, calc(100dvh - clamp(56px, 16dvh, 192px)));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(28px, 8dvh, 128px);

  @media (max-width: 720px) {
    min-height: calc(100dvh - 56px);
    justify-content: center;
    gap: clamp(22px, 7dvh, 64px);
  }
`;

const LogoWrapper = styled.div`
  width: min(100%, 990px);
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;

  @media (max-width: 720px) {
    width: min(100%, 560px);
  }
`;

const LoginActions = styled.div`
  width: min(100%, 679px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
`;

const LoginButton = styled.button`
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

  &:disabled {
    cursor: wait;
    opacity: 0.75;
  }

  @media (max-width: 520px) {
    justify-content: flex-start;
  }
`;

const MirimLogo = styled.img`
  width: clamp(48px, 11vw, 74px);
  height: clamp(48px, 11vw, 74px);
  border-radius: 84px;
  object-fit: cover;
`;

const ButtonText = styled.span`
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

const Description = styled.p`
  margin: 0;
  width: min(100%, 560px);
  font-size: clamp(16px, 3vw, 24px);
  color: #fab8be;
  text-align: center;
  line-height: 1.65;
  font-weight: 400;
`;

const TokenPanel = styled.form`
  display: grid;
  gap: 10px;
`;

const TokenInput = styled.input`
  width: 100%;
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.94);
  padding: 0 14px;
`;

const ErrorText = styled.p`
  min-height: 24px;
  margin: 0;
  color: #ffffff;
  text-align: center;
  line-height: 1.5;
`;

type LoginProps = {
  readonly oauthEnabled: boolean;
};

function Login({ oauthEnabled }: LoginProps) {
  const [error, setError] = useState('');

  return (
    <OuterContainer>
      <LoginContent>
        <LogoWrapper>
          <Logo src="/assets/home_logo.svg" alt="IEUM Logo" />
        </LogoWrapper>

        <LoginActions>
          {oauthEnabled ? <MirimOAuthLogin setError={setError} /> : <DevTokenLogin setError={setError} />}
          <ErrorText aria-live="polite">{error}</ErrorText>
        </LoginActions>
        <Description>
          미림마이스터고 선생님과 학생들만 이용할 수 있는
          <br />
          IEUM의 관리자 페이지입니다
        </Description>
      </LoginContent>
    </OuterContainer>
  );
}

function MirimOAuthLogin({ setError }: { readonly setError: (message: string) => void }) {
  const navigate = useNavigate();
  const { accessToken, isLoading, logIn, oauth } = useMirimOAuth();
  const mirimAccessToken = oauth?.accessToken ?? accessToken;

  const completeLogin = useCallback(
    async (token: string) => {
      await loginWithMirimToken(token);
      navigate('/admin', { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    if (!mirimAccessToken) return;
    void completeLogin(mirimAccessToken).catch((caught: unknown) => {
      if (!(caught instanceof Error)) throw caught;
      setError(caught.message);
    });
  }, [completeLogin, mirimAccessToken, setError]);

  const handleLogin = async () => {
    try {
      setError('');
      await logIn();
      if (mirimAccessToken) {
        await completeLogin(mirimAccessToken);
      }
    } catch (caught) {
      if (!(caught instanceof Error)) throw caught;
      setError(caught.message);
    }
  };

  return (
    <LoginButton type="button" onClick={handleLogin} disabled={isLoading}>
      <MirimLogo src="/assets/mirim-logo.webp" alt="" aria-hidden="true" />
      <ButtonText>{isLoading ? '로그인 중...' : 'Mirim OAuth로 로그인'}</ButtonText>
    </LoginButton>
  );
}

function DevTokenLogin({ setError }: { readonly setError: (message: string) => void }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(import.meta.env.VITE_IEUM_ADMIN_DEV_TOKEN ?? '');

  const handleLogin = async () => {
    try {
      setError('');
      await loginWithMirimToken(token.trim());
      navigate('/admin');
    } catch (caught) {
      if (!(caught instanceof Error)) throw caught;
      setError(caught.message);
    }
  };

  return (
    <>
      <LoginButton type="button" onClick={handleLogin}>
        <MirimLogo src="/assets/mirim-logo.webp" alt="" aria-hidden="true" />
        <ButtonText>테스트 토큰으로 로그인</ButtonText>
      </LoginButton>
      <TokenPanel
        onSubmit={(event) => {
          event.preventDefault();
          void handleLogin();
        }}
      >
        <TokenInput
          aria-label="Mirim OAuth 테스트 토큰"
          placeholder="Mirim OAuth access token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </TokenPanel>
    </>
  );
}

export default Login;
