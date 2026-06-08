import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';


const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2B2B2B; 
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
  margin-top: 81px; 
  padding: 51px 250px;
  height: calc(1080px - 81px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const SearchBarContainer = styled.div`
  width: 840px;
  height: 76px;
  border: 1px solid #E5E5E7;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  box-sizing: border-box;
  background-color: #FFFFFF;
  margin-bottom: 67px; 
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  color: #1F1F1F;
  &::placeholder {
    color: #c4c4c4ff;
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 22px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 13px 34px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 12px;
  background-color: ${({ active }) => (active ? '#E74E5B' : '#F1F1F5')};
  color: ${({ active }) => (active ? '#FFFFFF' : '#1F1F1F')};
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
`;

const CardGridContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  row-gap: 18px;         
  column-gap: 20px;      
  align-content: start;  
  overflow-y: auto;
  padding-right: 10px;
  padding-top: 10px;
  min-height: 0; 

  -ms-overflow-style: none; 
  scrollbar-width: none; 

  &::-webkit-scrollbar {
    display: none; 
  }
`;

const CompanyCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #E5E5E7;
  border-radius: 24px;
  padding: 26px;
  height: 120px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px); 
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  }
`;

const StudentName = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 20px 0;
`;

const CompanyName = styled.span`
  font-size: 16px;
  color: #8E8E93;
  font-weight: 400;
`;

const RedDot = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 12px;
  height: 12px;
  background-color: #E74E5B;
  border-radius: 50%;
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

/* =======================================
   상세 뷰 전용 스타일
   ======================================= */

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 20px;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 45px;
  padding-left: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0;
`;

const CarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  
  &:disabled {
    opacity: 0.2;
    cursor: default;
  }
`;

const GreyCard = styled.div`
  width: 1246px;
  height: 672px;
  background-color: #EEEEEE;
  border-radius: 24px;
  padding: 85px 120px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const InfoSection = styled.div`
  display: flex;
  gap: 80px;
`;

const SectionLabel = styled.div`
  width: 110px;
  font-size: 22px;
  font-weight: 600;
  color: #1F1F1F;
  padding-top: 20px; 
  flex-shrink: 0;
`;

const FieldsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoField = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px 24px;
  font-size: 18px;
  color: #333333;
  font-weight: 500;
  width: 100%;
  box-sizing: border-box;
`;

const PaginationDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: ${({ active }) => (active ? '48px' : '14px')};
  height: 14px;
  border-radius: 14px;
  background-color: ${({ active }) => (active ? '#E74E5B' : '#D1D1D6')};
  transition: all 0.3s ease;
`;

/* =======================================
   데이터 타입 및 분리된 상세 컴포넌트
   ======================================= */

interface Employment {
    id: number;
    companyName: string;
    address: string;
    name: string;
    contactName: string;
    role: string;
    phone: string;
    email: string;
    createdAt: Date;
}

interface EmploymentDetailProps {
    studentName: string;
    employments: Employment[];
    onClose: () => void;
}

const EmploymentDetail: React.FC<EmploymentDetailProps> = ({ studentName, employments, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleNext = () => {
        if (currentIndex < employments.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const currentJob = employments[currentIndex];

    if (!currentJob) return null;

    return (
        <DetailContainer>
            <DetailHeader>
                <CloseButton onClick={onClose}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </CloseButton>
                <DetailTitle>{studentName}</DetailTitle>
            </DetailHeader>

            <CarouselWrapper>
                <ArrowButton onClick={handlePrev} disabled={currentIndex === 0}>
                    <svg width="20" height="34" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2L2 14L14 26" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </ArrowButton>

                <GreyCard>
                    <InfoSection>
                        <SectionLabel>기업정보</SectionLabel>
                        <FieldsWrapper>
                            <InfoField>{currentJob.companyName}</InfoField>
                            <InfoField>{currentJob.address}</InfoField>
                        </FieldsWrapper>
                    </InfoSection>

                    <InfoSection>
                        <SectionLabel>담당자정보</SectionLabel>
                        <FieldsWrapper>
                            <InfoField>{currentJob.contactName}</InfoField>
                            <InfoField>{currentJob.role}</InfoField>
                            <InfoField>{currentJob.phone}</InfoField>
                            <InfoField>{currentJob.email}</InfoField>
                        </FieldsWrapper>
                    </InfoSection>
                </GreyCard>

                <ArrowButton onClick={handleNext} disabled={currentIndex === employments.length - 1}>
                    <svg width="20" height="34" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2L14 14L2 26" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </ArrowButton>
            </CarouselWrapper>

            {employments.length > 1 && (
                <PaginationDots>
                    {employments.map((_, index) => (
                        <Dot key={index} active={index === currentIndex} />
                    ))}
                </PaginationDots>
            )}
        </DetailContainer>
    );
};

/* =======================================
   메인 홈 화면 컴포넌트
   ======================================= */

const TeacherHome: React.FC = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [readCardIds, setReadCardIds] = useState<number[]>([]);
    const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);

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

    const [employments] = useState<Employment[]>([
        { id: 1, name: '3515 정지영', companyName: '신영증권', address: '서울특별시 영등포구 국제금융로8길 16', contactName: '정박사', role: '헤리티지 솔루션부 팀장', phone: '010-9082-7378', email: 'd2416@e-mirim.hs.kr', createdAt: new Date() },
        { id: 2, name: '3515 정지영', companyName: '카카오', address: '제주특별자치도 제주시 첨단로 242', contactName: '김라이언', role: '인사팀 파트장', phone: '010-1234-5678', email: 'ryan@kakao.com', createdAt: new Date() },
        { id: 3, name: '3515 정지영', companyName: '네이버', address: '경기도 성남시 분당구 불정로 6', contactName: '이코니', role: '채용담당자', phone: '010-9999-8888', email: 'cony@naver.com', createdAt: new Date() },
        { id: 4, name: '1204 김민수', companyName: '토스', address: '서울특별시 강남구 테헤란로 142', contactName: '박토스', role: '엔지니어링 매니저', phone: '010-1111-2222', email: 'recruit@toss.im', createdAt: new Date() },
        { id: 5, name: '2301 이수진', companyName: '배달의민족', address: '서울특별시 송파구 위례성대로 2', contactName: '최배달', role: 'HR 매니저', phone: '010-3333-4444', email: 'hr@woowahan.com', createdAt: new Date() },
    ]);

    const getStudentClass = (nameStr: string): string => {
        if (nameStr.length >= 2 && !isNaN(Number(nameStr[1]))) {
            return nameStr[1];
        }
        return '';
    };

    // 카드 클릭 시 해당 학생의 "모든" 취업 건(ID 배열)을 읽음 처리
    const handleCardClick = (ids: number[], name: string) => {
        const newUnreadIds = ids.filter(id => !readCardIds.includes(id));
        if (newUnreadIds.length > 0) {
            setReadCardIds([...readCardIds, ...newUnreadIds]);
        }
        setSelectedStudentName(name);
    };

    const selectedEmployments = employments.filter(emp => emp.name === selectedStudentName);

    // 1. 검색 및 탭 필터링 수행
    const filteredEmployments = employments.filter((emp) => {
        const matchesTab = activeTab === 'all' || getStudentClass(emp.name) === activeTab;
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // 2. 필터링된 결과를 '학생 이름' 기준으로 그룹화
    const uniqueStudents = Array.from(new Set(filteredEmployments.map(emp => emp.name)));

    const displayCards = uniqueStudents.map(studentName => {
        // 해당 학생의 채용 건만 필터링
        const studentEmps = filteredEmployments.filter(emp => emp.name === studentName);
        const firstEmp = studentEmps[0];
        const count = studentEmps.length;

        // 학생의 연락 중 하나라도 읽지 않은 상태 + 특정 조건(2,3,5)이면 빨간 점 표시 (목업 데이터 기준)
        const showRedDot = studentEmps.some(emp => !readCardIds.includes(emp.id) && [2, 3, 5].includes(emp.id));

        // 학생이 보유한 모든 알림 ID 묶음
        const allEmpIds = studentEmps.map(emp => emp.id);

        return {
            key: firstEmp.id,
            name: studentName,
            displayCompanyName: count > 1 ? `${firstEmp.companyName} 외 ${count - 1}건` : firstEmp.companyName,
            showRedDot,
            allEmpIds
        };
    });

    const tabs = [
        { id: 'all', label: '전체' },
        { id: '1', label: '1반' },
        { id: '2', label: '2반' },
        { id: '3', label: '3반' },
        { id: '4', label: '4반' },
        { id: '5', label: '5반' },
        { id: '6', label: '6반' },
    ];

    return (
        <OuterContainer>
            <InnerCanvas style={{ transform: `scale(${scale})` }}>
                <Navbar onProfileClick={() => setIsProfileOpen(!isProfileOpen)} />

                {isProfileOpen && <ProfileCard onClose={() => setIsProfileOpen(false)} />}

                <ContentWrapper>
                    {selectedStudentName ? (
                        <EmploymentDetail
                            studentName={selectedStudentName}
                            employments={selectedEmployments}
                            onClose={() => setSelectedStudentName(null)}
                        />
                    ) : (
                        <>
                            <SearchBarContainer>
                                <SearchInput
                                    type="text"
                                    placeholder="학생의 이름 혹은 학번을 검색하세요"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <img src="/assets/icons/search.svg" alt="IEUM" style={{ width: "24px", height: '24px' }} />
                            </SearchBarContainer>

                            <TabGroup>
                                {tabs.map((tab) => (
                                    <TabButton
                                        key={tab.id}
                                        active={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                    </TabButton>
                                ))}
                            </TabGroup>

                            {displayCards.length === 0 ? (
                                <EmptyState>아직 채용을 희망하는 회사가 없습니다</EmptyState>
                            ) : (
                                <CardGridContainer>
                                    {displayCards.map((card) => (
                                        <CompanyCard key={card.key} onClick={() => handleCardClick(card.allEmpIds, card.name)}>
                                            <StudentName>{card.name}</StudentName>
                                            <CompanyName>{card.displayCompanyName}</CompanyName>
                                            {card.showRedDot && <RedDot />}
                                        </CompanyCard>
                                    ))}
                                </CardGridContainer>
                            )}
                        </>
                    )}
                </ContentWrapper>
            </InnerCanvas>
        </OuterContainer>
    );
};

export default TeacherHome;