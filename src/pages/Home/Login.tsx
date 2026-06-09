import { useMirimOAuth } from 'mirim-oauth-react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loginWithMirimToken } from '../../api/adminApi';

const OuterContainer = styled.div`
  min-height: 100dvh;
  background: linear-gradient(134.188deg, #f25c69 2.1959%, #cd3f4b 97.804%);
  display: grid;
  place-items: center;
  overflow: hidden;
`;

const InnerCanvas = styled.div`
  position: relative;
  width: 1920px;
  height: 1080px;
  transform: scale(min(100vw / 1920, 100dvh / 1080));
  transform-origin: center;
`;

const LogoWrapper = styled.div`
  position: absolute;
  left: 465px;
  top: 246px;
  width: 990px;
  height: 90px;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const LoginButton = styled.button`
  position: absolute;
  left: 621px;
  top: 687px;
  width: 679px;
  height: 106px;
  border-radius: 71px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  &:disabled {
    cursor: wait;
    opacity: 0.75;
  }

`;

const MirimLogo = styled.img`
  width: 74px;
  height: 74px;
  border-radius: 84px;
  object-fit: cover;
`;

const ButtonText = styled.span`
  width: 384px;
  font-size: 32px;
  font-weight: 500;
  color: #000000;
`;

const Description = styled.p`
  position: absolute;
  left: 698px;
  top: 871px;
  width: 525px;
  font-size: 24px;
  color: #fab8be;
  text-align: center;
  line-height: 40px;
  font-weight: 400;
`;

const TokenPanel = styled.form`
  position: absolute;
  left: 621px;
  top: 812px;
  width: 679px;
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
  position: absolute;
  left: 621px;
  top: 812px;
  width: 679px;
  color: #ffffff;
  text-align: center;
`;

type LoginProps = {
  readonly oauthEnabled: boolean;
};

function Login({ oauthEnabled }: LoginProps) {
  const [error, setError] = useState('');

  return (
    <OuterContainer>
      <InnerCanvas>
        <LogoWrapper>
          <Logo src="/assets/home_logo.svg" alt="IEUM Logo" />
        </LogoWrapper>

        {oauthEnabled ? <MirimOAuthLogin setError={setError} /> : <DevTokenLogin setError={setError} />}
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Description>
          미림마이스터고 선생님과 학생들만 이용할 수 있는
          <br />
          IEUM의 관리자 페이지입니다
        </Description>
      </InnerCanvas>
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
      <MirimLogo src="/assets/mirim-logo.png" alt="" aria-hidden="true" />
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
        <MirimLogo src="/assets/mirim-logo.png" alt="" aria-hidden="true" />
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
