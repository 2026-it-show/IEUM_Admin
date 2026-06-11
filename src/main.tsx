import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found');
}

// OAuth 팝업이 redirect_uri(앱 루트)로 돌아온 경우:
// React 앱을 부팅하면 라우터가 즉시 URL을 바꿔 ?code= 가 유실되므로(폴링 레이스),
// 앱을 띄우지 않고 opener에 콜백 URL을 postMessage로 전달한 뒤 창을 닫는다.
const oauthParams = new URLSearchParams(window.location.search);
const isOAuthPopupCallback =
  Boolean(window.opener) &&
  window.opener !== window &&
  oauthParams.has('state') &&
  (oauthParams.has('code') || oauthParams.has('error'));

if (isOAuthPopupCallback) {
  try {
    (window.opener as Window).postMessage(
      { type: 'oauth_callback', url: window.location.href },
      window.location.origin,
    );
  } catch {
    // opener가 닫혔으면 무시 — 아래 안내 문구만 보여준다
  }
  rootElement.textContent = '로그인 처리 중입니다. 이 창은 자동으로 닫힙니다.';
  window.setTimeout(() => {
    window.close();
  }, 400);
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
