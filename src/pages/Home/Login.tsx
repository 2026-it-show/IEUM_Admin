import { useMirimOAuth } from 'mirim-oauth-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithMirimToken } from '../../api/adminApi';
import * as S from './Login.styled';

type LoginProps = {
  readonly oauthEnabled: boolean;
};

function Login({ oauthEnabled }: LoginProps) {
  const [error, setError] = useState('');

  return (
    <S.OuterContainer>
      <S.LoginContent>
        <S.LogoWrapper>
          <S.Logo src="/assets/home_logo.svg" alt="IEUM Logo" />
        </S.LogoWrapper>

        <S.LoginActions>
          {oauthEnabled ? <MirimOAuthLogin setError={setError} /> : <DevTokenLogin setError={setError} />}
          <S.ErrorText aria-live="polite">{error}</S.ErrorText>
        </S.LoginActions>
        <S.Description>
          미림마이스터고 선생님과 학생들만 이용할 수 있는
          <br />
          IEUM의 관리자 페이지입니다
        </S.Description>
      </S.LoginContent>
    </S.OuterContainer>
  );
}

function MirimOAuthLogin({ setError }: { readonly setError: (message: string) => void }) {
  const navigate = useNavigate();
  const { accessToken, isLoading, logIn, oauth } = useMirimOAuth();
  const mirimAccessToken = oauth?.accessToken ?? accessToken;

  const completeLogin = useCallback(
    async (token: string) => {
      await loginWithMirimToken(token);
      navigate('/', { replace: true });
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
    <S.LoginButton type="button" onClick={handleLogin} disabled={isLoading}>
      <S.MirimLogo src="/assets/mirim-logo.webp" alt="" aria-hidden="true" />
      <S.ButtonText>{isLoading ? '로그인 중...' : 'Mirim OAuth로 로그인'}</S.ButtonText>
    </S.LoginButton>
  );
}

function DevTokenLogin({ setError }: { readonly setError: (message: string) => void }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(import.meta.env.VITE_IEUM_ADMIN_DEV_TOKEN ?? '');

  const handleLogin = async () => {
    try {
      setError('');
      await loginWithMirimToken(token.trim());
      navigate('/');
    } catch (caught) {
      if (!(caught instanceof Error)) throw caught;
      setError(caught.message);
    }
  };

  return (
    <>
      <S.LoginButton type="button" onClick={handleLogin}>
        <S.MirimLogo src="/assets/mirim-logo.webp" alt="" aria-hidden="true" />
        <S.ButtonText>테스트 토큰으로 로그인</S.ButtonText>
      </S.LoginButton>
      <S.TokenPanel
        onSubmit={(event) => {
          event.preventDefault();
          void handleLogin();
        }}
      >
        <S.TokenInput
          aria-label="Mirim OAuth 테스트 토큰"
          placeholder="Mirim OAuth access token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </S.TokenPanel>
    </>
  );
}

export default Login;
