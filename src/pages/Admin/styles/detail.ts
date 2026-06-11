import styled from 'styled-components';

export const DetailShell = styled.section`
  position: relative;
  min-height: calc(100dvh - 81px);
  padding: 63px 0 80px;

  @media (max-width: 760px) {
    min-height: calc(100dvh - 70px);
    padding: 32px 0 56px;
  }
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  max-width: 1246px;
  margin: 0 auto;

  @media (max-width: 1320px) {
    padding: 0 24px;
  }

  @media (max-width: 760px) {
    gap: 16px;
    padding: 0 18px;
  }
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

  @media (max-width: 760px) {
    font-size: 24px;
  }
`;

export const DetailCarousel = styled.div`
  position: relative;
  width: min(100%, 1474px);
  margin: 34px auto 0;
  display: grid;
  grid-template-columns: 56px minmax(0, 1246px) 56px;
  align-items: center;
  gap: 34px;

  @media (max-width: 1480px) {
    width: 100%;
    grid-template-columns: 48px minmax(0, 1fr) 48px;
    gap: 18px;
    padding: 0 32px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 36px minmax(0, 1fr) 36px;
    gap: 8px;
    padding: 0 12px;
    margin-top: 28px;
  }
`;

export const DetailArrow = styled.button<{ readonly $direction: 'left' | 'right' }>`
  width: 56px;
  height: 96px;
  background: url(${({ $direction }) => ($direction === 'left' ? '/assets/icons/carousel-left.svg' : '/assets/icons/carousel-right.svg')}) center / 24px 40px no-repeat;
  border-radius: 999px;

  &:hover {
    background-color: #f6f6f6;
  }

  @media (max-width: 760px) {
    width: 36px;
    height: 72px;
    background-size: 18px 30px;
  }
`;

export const DetailPanel = styled.div`
  /* 화살표가 없을 때(연락처 1건)도 가운데 콘텐츠 칸을 차지해야 한다 */
  grid-column: 2;
  width: 100%;
  min-height: 672px;
  padding: 99px 113px 64px 114px;
  border-radius: 24px;
  background: #eeeeee;
  display: grid;
  grid-template-columns: 180px minmax(0, 806px);
  gap: 16px 33px;
  align-content: start;
  touch-action: pan-y;
  user-select: none;

  @media (max-width: 900px) {
    min-height: 0;
    padding: 42px 28px;
    grid-template-columns: 1fr;
  }

  @media (max-width: 760px) {
    padding: 28px 16px;
    border-radius: 20px;
  }
`;

export const DetailLabel = styled.h2`
  color: #000000;
  font-size: 24px;
  line-height: 55px;
  font-weight: 500;

  @media (max-width: 760px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

export const DetailValues = styled.div`
  display: grid;
  gap: 16px;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
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

  @media (max-width: 760px) {
    min-height: 48px;
    font-size: 16px;
    line-height: 28px;
  }
`;

export const DetailIndicators = styled.div`
  position: relative;
  z-index: 2;
  margin: -28px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 760px) {
    margin-top: 18px;
  }
`;

export const DetailIndicator = styled.button<{ readonly $active: boolean }>`
  width: ${({ $active }) => ($active ? '48px' : '13px')};
  height: 13px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#e74e5b' : '#d9d9d9')};
  transition: width 160ms ease, background 160ms ease;

  @media (max-width: 760px) {
    width: ${({ $active }) => ($active ? '34px' : '10px')};
    height: 10px;
  }
`;
