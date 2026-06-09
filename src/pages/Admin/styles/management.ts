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
