import { MirimOAuthProvider } from 'mirim-oauth-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { RolePreviewSwitch } from './components/RolePreviewSwitch';
import { GlobalStyle, theme } from './styles';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Login from './pages/Home/Login';

type MirimOAuthConfig = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly oauthServerUrl: string | undefined;
  readonly scopes: string;
};

const mirimOAuthConfig = readMirimOAuthConfig();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        <RolePreviewSwitch />

        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/oauth/*" element={<LoginRoute />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/student/home" element={<Navigate to="/" replace />} />
          <Route path="/teacher/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function LoginRoute() {
  if (!mirimOAuthConfig) {
    return <Login oauthEnabled={false} />;
  }

  return (
    <MirimOAuthProvider
      clientId={mirimOAuthConfig.clientId}
      clientSecret={mirimOAuthConfig.clientSecret}
      redirectUri={mirimOAuthConfig.redirectUri}
      oauthServerUrl={mirimOAuthConfig.oauthServerUrl}
      scopes={mirimOAuthConfig.scopes}
    >
      <Login oauthEnabled />
    </MirimOAuthProvider>
  );
}

function readMirimOAuthConfig(): MirimOAuthConfig | null {
  const clientId = readEnv('VITE_MIRIM_OAUTH_CLIENT_ID');
  const clientSecret = readEnv('VITE_MIRIM_OAUTH_CLIENT_SECRET');
  const redirectUri = readEnv('VITE_MIRIM_OAUTH_REDIRECT_URI');
  const scopes = readEnv('VITE_MIRIM_OAUTH_SCOPES');

  if (!clientId || !clientSecret || !redirectUri || !scopes) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    oauthServerUrl: readEnv('VITE_MIRIM_OAUTH_SERVER_URL'),
    scopes,
  };
}

function readEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export default App;
