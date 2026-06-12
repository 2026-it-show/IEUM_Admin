import styled from 'styled-components';

export const ManageSection = styled.section`
  display: grid;
  gap: 20px;
`;

export const ProjectGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectCard = styled.article`
  min-height: 236px;
  padding: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #ffffff;
`;

export const RoleBadge = styled.span`
  position: absolute;
  right: 25px;
  bottom: 20px;
  color: #e74e5b;
  font-size: 14px;
`;

export const MiniButton = styled.button`
  min-height: 32px;
  padding: 0 12px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #222222;
`;

export const WordCard = styled.article`
  position: relative;
  min-height: 120px;
  padding: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #ffffff;
`;

export const WordSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  color: #555555;
  font-size: 16px;

  span:first-child {
    color: #222222;
    font-weight: 700;
  }

  span {
    min-height: 34px;
    padding: 6px 12px;
    border: 1px solid #e6e6e6;
    border-radius: 12px;
    background: #ffffff;
  }
`;

export const WordForm = styled.form`
  display: flex;
  gap: 12px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const WordInput = styled.input`
  min-height: 46px;
  flex: 1;
  min-width: 0;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  padding: 0 16px;
`;

export const PageSizeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: #555555;
  font-size: 16px;
`;

export const PageSizeSelect = styled.select`
  min-height: 42px;
  padding: 0 38px 0 14px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #ffffff url('/assets/icons/chevron-down.svg') right 14px center / 16px 16px no-repeat;
  color: #222222;
  font-size: 16px;
`;

export const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0 0;
`;

export const PageButton = styled.button`
  min-width: 88px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #222222;
  font-size: 16px;

  &:disabled {
    color: #aaaaaa;
    cursor: not-allowed;
  }
`;

export const PageNumberButton = styled.button<{ readonly $active: boolean }>`
  min-width: 42px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? '#e74e5b' : '#f5f5f5')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#222222')};
  font-size: 16px;

  &:disabled {
    cursor: ${({ $active }) => ($active ? 'default' : 'not-allowed')};
  }
`;

export const PageEllipsis = styled.span`
  min-width: 28px;
  color: #777777;
  font-size: 16px;
  text-align: center;
`;
