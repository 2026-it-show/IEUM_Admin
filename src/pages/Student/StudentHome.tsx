import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar'; // 위에서 만든 내비바 임포트
import ProfileCard from '../../components/ProfileCard'; // 새로 만든 프로필 카드 임포트

/* 스타일 정의 */

const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2B2B2B; /* 글로벌 스타일 보디 배경색 반영 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const InnerCanvas = styled.div`
  width: 1920px;
  height: 1080px;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  transform-origin: center center;
`;

const ContentWrapper = styled.div`
  margin-top: 81px; /* 내비바 높이만큼 마진 배치 */
  padding: 51px 250px;
  height: calc(1080px - 81px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  position: relative;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 13px 34px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 12px;
  background-color: ${({ active }) => (active ? '#E74E5B' : '#F1F1F5')};
  color: ${({ active }) => (active ? '#FFFFFF' : '#1F1F1F')};
  transition: all 0.2s ease;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-size: 20px;
  border: 1px solid #E5E5E7;
  border-radius: 20px;
  background-color: #FFFFFF;
  color: #1F1F1F;
`;

const DropdownIcon = styled.svg<{ open: boolean }>`
  width: 20px;
  height: 20px;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 150px;
  background-color: #F5F5F7;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  padding: 8px 0;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 12px 24px;
  font-size: 16px;
  color: #1F1F1F;
  cursor: pointer;
  &:hover {
    background-color: #E5E5E7;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #D1D1D6;
  font-weight: 500;
`;

const CardGridContainer = styled.div`
  flex: 1;
  column-count: 4;
  column-gap: 25px;
  overflow-y: auto; /* 카드가 많아지면 여기서 스크롤이 발생합니다 */
  padding-right: 10px;
  min-height: 0; 

  -ms-overflow-style: none; 
  scrollbar-width: none; 

  &::-webkit-scrollbar {
    display: none; 
  }
`;

const FeedbackCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #E5E5E7;
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 25px; 
  break-inside: avoid; 
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;

const CardBadge = styled.span<{ project: string }>`
  align-self: flex-start;
  background-color: ${({ project }) => (project === 'Project2' ? '#F9C96B' : '#F399BE')};
  color: #222222;
  font-size: 16px;
  font-weight: 500;
  padding: 5px 15px;
  border-radius: 25px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1F1F1F;
  margin-bottom: 20px;
`;

const CardBody = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #4A4A4A;
  font-weight: 400;
  word-break: break-all;
`;

interface Feedback {
  id: number;
  project: string;
  author: string;
  content: string;
  createdAt: Date; 
}

const StudentHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'proj1' | 'proj2'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  
  // [추가] 프로필 카드 모달 제어용 상태
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [scale, setScale] = useState(() => {
    const widthScale = window.innerWidth / 1920;
    const heightScale = window.innerHeight / 1080;
    const minScale = Math.min(widthScale, heightScale);
    return minScale > 1 ? 1 : minScale;
  });

  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / 1920;
      const heightScale = window.innerHeight / 1080;
      const minScale = Math.min(widthScale, heightScale);
      setScale(minScale > 1 ? 1 : minScale);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [feedbacks] = useState<Feedback[]>([
    { id: 1, project: 'Project1', author: '기똥찬 라이언', content: '화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ 화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ 화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ', createdAt: new Date('2026-06-01 10:00:00') },
    { id: 2, project: 'Project2', author: '똑똑한 네오', content: 'Project2 피드백입니다! 웹앱 레이아웃이 아주 깔끔하고 사용하기 편리하네요. 미림마이스터고 화이팅입니다!', createdAt: new Date('2026-06-03 14:20:00') },
    { id: 3, project: 'Project1', author: '신난 튜브', content: '화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ 화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ', createdAt: new Date('2026-06-02 09:15:00') },
    { id: 4, project: 'Project2', author: '수줍은 어피치', content: '색감 선정이 예뻐서 눈이 편안해요. 메인 컬러인 피치/오렌지 계열 포인트가 아주 매력적입니다.', createdAt: new Date('2026-06-05 18:00:00') },
    { id: 5, project: 'Project1', author: '심각한 프로도', content: '버튼들의 인터랙션 피드백이 직관적이라 좋았어요. 다만 폰트 크기가 대화면에서 조금 가독성이 아쉽습니다.', createdAt: new Date('2026-06-04 11:30:00') },
    { id: 6, project: 'Project2', author: '무뚝뚝한 콘', content: '컴포넌트 구조화가 아주 잘 정돈되어 있습니다. 반응형 스케일 기능도 훌륭하게 작동하네요.', createdAt: new Date('2026-06-07 13:00:00') },
    { id: 7, project: 'Project1', author: '배고픈 제이지', content: '화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ 화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ 화이팅 다들 화이팅 폐급 디자이너와 함께 해주어 고맙소ㅇㅇ', createdAt: new Date('2026-05-28 17:45:00') },
    { id: 8, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 9, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 10, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 11, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 12, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 13, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 14, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 15, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 16, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 17, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
    { id: 18, project: 'Project2', author: '다정한 춘식이', content: '구글 로그인 연동 속도도 빠르고 메인 카드 피드가 핀터레스트 스타일이라 피드백 읽는 재미가 쏠쏠해요!', createdAt: new Date('2026-06-09 09:00:00') },
  ]);

  const getFilteredAndSortedFeedbacks = () => {
    let result = feedbacks.filter((fb) => {
      if (activeTab === 'proj1') return fb.project === 'Project1';
      if (activeTab === 'proj2') return fb.project === 'Project2';
      return true;
    });

    return result.sort((a, b) => {
      if (sortType === 'latest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });
  };

  const displayFeedbacks = getFilteredAndSortedFeedbacks();

  return (
    <OuterContainer>
      <InnerCanvas style={{ transform: `scale(${scale})` }}>
        {/* Navbar의 프로필 사진을 클릭했을 때 이 상태가 바뀌도록 프롭스를 전달합니다. */}
        <Navbar onProfileClick={() => setIsProfileOpen(!isProfileOpen)} />

        {/* 프로필 창이 켜져 있을 때 띄우기 */}
        {isProfileOpen && <ProfileCard onClose={() => setIsProfileOpen(false)} />}

        <ContentWrapper>
          <FilterBar>
            <TabGroup>
              <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>전체</TabButton>
              <TabButton active={activeTab === 'proj1'} onClick={() => setActiveTab('proj1')}>Project1</TabButton>
              <TabButton active={activeTab === 'proj2'} onClick={() => setActiveTab('proj2')}>Project2</TabButton>
            </TabGroup>

            <DropdownWrapper>
              <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {sortType === 'latest' ? '최신순' : '오래된순'}
                <DropdownIcon viewBox="0 0 24 24" open={isDropdownOpen}>
                  <path d="M7 10l5 5 5-5z" fill="#1F1F1F"/>
                </DropdownIcon>
              </DropdownButton>
              {isDropdownOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={() => { setSortType('latest'); setIsDropdownOpen(false); }}>최신순</DropdownItem>
                  <DropdownItem onClick={() => { setSortType('oldest'); setIsDropdownOpen(false); }}>오래된순</DropdownItem>
                </DropdownMenu>
              )}
            </DropdownWrapper>
          </FilterBar>

          {displayFeedbacks.length === 0 ? (
            <EmptyState>아직 받은 피드백이 없습니다</EmptyState>
          ) : (
            <CardGridContainer>
              {displayFeedbacks.map((fb) => (
                <FeedbackCard key={fb.id}>
                  <CardBadge project={fb.project}>{fb.project}</CardBadge>
                  <CardTitle>{fb.author}</CardTitle>
                  <CardBody>{fb.content}</CardBody>
                </FeedbackCard>
              ))}
            </CardGridContainer>
          )}
        </ContentWrapper>
      </InnerCanvas>
    </OuterContainer>
  );
};

export default StudentHome;