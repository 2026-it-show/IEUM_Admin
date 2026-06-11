import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { readStoredToken } from '../api/adminApi';
import { readPreviewRole, type PreviewRole } from '../pages/Admin/previewData';

const PREVIEW_ROLES: readonly { readonly role: PreviewRole; readonly label: string }[] = [
  { role: 'student', label: '학생 UI' },
  { role: 'teacher', label: '선생님 UI' },
] as const;

export function RolePreviewSwitch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentRole = readPreviewRole(searchParams.get('preview'));

  if (readStoredToken()) return null;

  return (
    <SwitchWrap aria-label="테스트 UI 전환">
      {PREVIEW_ROLES.map((item) => (
        <SwitchButton
          key={item.role}
          type="button"
          $active={currentRole === item.role}
          onClick={() => navigate(`/?preview=${item.role}`)}
        >
          {item.label}
        </SwitchButton>
      ))}
    </SwitchWrap>
  );
}

const SwitchWrap = styled.nav`
  position: fixed;
  left: 50%;
  top: 14px;
  z-index: 100;
  display: flex;
  max-width: calc(100vw - 24px);
  transform: translateX(-50%);
  gap: 8px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.14);
  overflow-x: auto;
`;

const SwitchButton = styled.button<{ readonly $active: boolean }>`
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#e74e5b' : '#f5f5f5')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#222222')};
  font-size: 14px;
  white-space: nowrap;

  @media (max-width: 520px) {
    min-height: 34px;
    padding: 0 12px;
    font-size: 13px;
  }
`;
