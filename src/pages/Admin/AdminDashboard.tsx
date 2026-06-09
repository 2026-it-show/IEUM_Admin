import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHomeSnapshot, readStoredToken, type HomeSnapshot } from '../../api/adminApi';
import { AdminHeader } from './components/AdminHeader';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { StaffDashboard } from './components/StaffDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { type LoadStatus, type SortKey, type StaffViewKey } from './adminTypes';
import * as S from './AdminDashboard.styled';

function AdminDashboard() {
  const navigate = useNavigate();
  const token = useMemo(() => readStoredToken(), []);
  const [view, setView] = useState<StaffViewKey>('contacts');
  const [studentProjectId, setStudentProjectId] = useState('all');
  const [sort, setSort] = useState<SortKey>('latest');
  const [snapshot, setSnapshot] = useState<HomeSnapshot | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    await loadSnapshot(token, setSnapshot, setStatus, setMessage, navigate);
  }, [navigate, token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (status === 'loading') return <DashboardSkeleton />;
  if (status === 'error' || !snapshot) return <ErrorScreen message={message} onLogin={() => navigate('/login', { replace: true })} />;

  return (
    <S.Page>
      <AdminHeader
        user={snapshot.user}
        token={token}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        navigateLogin={() => navigate('/login', { replace: true })}
      />
      {snapshot.kind === 'student' ? (
        <StudentDashboard
          snapshot={snapshot}
          projectId={studentProjectId}
          setProjectId={setStudentProjectId}
          sort={sort}
          setSort={setSort}
        />
      ) : (
        <StaffDashboard snapshot={snapshot} view={view} setView={setView} sort={sort} setSort={setSort} token={token} refresh={refresh} />
      )}
    </S.Page>
  );
}

async function loadSnapshot(
  token: string,
  setSnapshot: (snapshot: HomeSnapshot | null) => void,
  setStatus: (status: LoadStatus) => void,
  setMessage: (message: string) => void,
  navigate: (to: string, options: { readonly replace: boolean }) => void,
): Promise<void> {
  try {
    setStatus('loading');
    setSnapshot(await fetchHomeSnapshot(token));
    setMessage('');
    setStatus('ready');
  } catch (caught) {
    if (!(caught instanceof Error)) throw caught;
    setMessage(caught.message);
    setStatus('error');
    if (caught.message.includes('401') || caught.message.includes('로그인') || caught.message.includes('Unauthorized')) {
      navigate('/login', { replace: true });
    }
  }
}

function ErrorScreen({ message, onLogin }: { readonly message: string; readonly onLogin: () => void }) {
  return (
    <S.Center>
      <S.ErrorText>{message || '데이터를 불러오지 못했습니다'}</S.ErrorText>
      <S.PrimaryButton type="button" onClick={onLogin}>
        로그인으로 이동
      </S.PrimaryButton>
    </S.Center>
  );
}

export default AdminDashboard;
