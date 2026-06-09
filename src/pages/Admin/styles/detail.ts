import styled from 'styled-components';

export const DetailShell = styled.section`
  position: relative;
  min-height: calc(100dvh - 81px);
  padding: 63px 0 80px;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

export const BackButton = styled.button`
  width: 52px;
  height: 52px;
  color: #222222;
  font-size: 42px;
  line-height: 1;
`;

export const DetailTitle = styled.h1`
  color: #222222;
  font-size: 32px;
  line-height: 35px;
  font-weight: 500;
`;

export const DetailPanel = styled.div`
  width: min(100%, 1246px);
  min-height: 672px;
  margin: 34px auto 0;
  padding: 99px 113px 64px 114px;
  border-radius: 24px;
  background: #eeeeee;
  display: grid;
  grid-template-columns: 180px minmax(0, 806px);
  gap: 16px 33px;
  align-content: start;

  @media (max-width: 900px) {
    min-height: 0;
    padding: 32px 18px;
    grid-template-columns: 1fr;
  }
`;

export const DetailLabel = styled.h2`
  color: #000000;
  font-size: 24px;
  line-height: 55px;
  font-weight: 500;
`;

export const DetailValues = styled.div`
  display: grid;
  gap: 16px;
`;

export const DetailValue = styled.p`
  min-height: 55px;
  padding: 10px 15px;
  border-radius: 12px;
  background: #ffffff;
  color: #444444;
  font-size: 20px;
  line-height: 35px;
  overflow-wrap: anywhere;
`;
