import type { AdminSnapshot, AdminUser, Contact, Feedback, HomeSnapshot, ProjectSummary, StudentSnapshot } from '../../api/adminApi';

export type PreviewRole = 'admin' | 'teacher' | 'student';

const previewProjects: readonly ProjectSummary[] = [
  project('project-growy', 'Growy', 'Growy', '호주 Gap Year 청년들이 다양한 경험을 통해 자신의 적성을 발견하고 기록하는 구인구직 서비스', 'global', 'G1', 12, 3, 34),
  project('project-bbei', '쁘이', '쁘이', '부스에서 바로 체험할 수 있는 창의 경험 프로젝트', 'creative', 'E1', 8, 2, 19),
  project('project-mony', 'Mony', 'Mony', '개인 금융 습관을 돕는 퍼스널 경험 서비스', 'personal', 'D1', 16, 5, 41),
  project('project-ieum', '이음', '이음', '전시 프로젝트와 관람객을 연결하는 통합 경험 지도 서비스', 'network', 'C1', 25, 7, 68),
  project('project-narru', 'Narru', 'Narru', '사용자 감정 여정을 기록하고 공유하는 휴먼 경험 서비스', 'human', 'B1', 9, 1, 22),
];

const teacherUser: AdminUser = {
  id: 'preview-teacher',
  name: '3515 정지영',
  email: 'teacher@e-mirim.hs.kr',
  profileImageUrl: null,
  role: 'teacher',
};

const adminUser: AdminUser = {
  id: 'preview-admin',
  name: '관리자',
  email: 'admin@e-mirim.hs.kr',
  profileImageUrl: null,
  role: 'admin',
};

const studentUser: AdminUser = {
  id: 'preview-student',
  name: '3515 정지영',
  email: 'd2416@e-mirim.hs.kr',
  profileImageUrl: null,
  role: 'student',
};

export function readPreviewRole(value: string | null): PreviewRole | null {
  if (value === 'admin' || value === 'teacher' || value === 'student') return value;
  return null;
}

export function createPreviewSnapshot(role: PreviewRole): HomeSnapshot {
  if (role === 'student') return createStudentSnapshot();
  return createStaffSnapshot(role === 'admin' ? adminUser : teacherUser);
}

function createStudentSnapshot(): StudentSnapshot {
  return {
    kind: 'student',
    user: studentUser,
    projects: previewProjects.slice(0, 3),
    projectFeedback: previewProjects.slice(0, 3).map((projectItem, index) => ({
      project: projectItem,
      feedback: {
        items: [
          feedback(`student-feedback-${index}-1`, projectItem.id, '기획 의도가 명확하고 발표 흐름이 이해하기 쉬웠습니다.'),
          feedback(`student-feedback-${index}-2`, projectItem.id, '데모 화면의 핵심 기능이 더 빠르게 보이면 좋겠습니다.'),
        ],
        nextCursor: null,
      },
    })),
  };
}

function createStaffSnapshot(user: AdminUser): AdminSnapshot & { readonly kind: 'staff' } {
  return {
    kind: 'staff',
    user,
    dashboard: {
      projectCount: previewProjects.length,
      feedbackCount: 18,
      contactCount: 6,
      newContactCount: 3,
      interestCount: 184,
      feedbackByStatus: { public: 16, blocked: 2 },
      contactsByStatus: { new: 3, checked: 3 },
    },
    projects: { items: previewProjects, nextCursor: null },
    feedback: {
      items: previewProjects.flatMap((projectItem, index) => [
        feedback(`staff-feedback-${index}-1`, projectItem.id, '서비스 아이디어와 사용자 시나리오가 잘 연결되어 있습니다.'),
        feedback(`staff-feedback-${index}-2`, projectItem.id, '발표 자료에서 문제 정의가 조금 더 앞에 오면 좋겠습니다.'),
      ]),
      nextCursor: null,
    },
    contacts: { items: previewContacts(), nextCursor: null },
    users: { items: [adminUser, teacherUser, studentUser], nextCursor: null },
    bannedWords: {
      items: [
        { id: 'preview-word-1', word: '욕설', isActive: true },
        { id: 'preview-word-2', word: '비방', isActive: true },
      ],
      nextCursor: null,
    },
  };
}

function project(
  id: string,
  serviceName: string,
  teamName: string,
  description: string,
  experienceCategory: string,
  boothSlot: string,
  feedbackCount: number,
  contactCount: number,
  interestCount: number,
): ProjectSummary {
  return {
    id,
    serviceName,
    teamName,
    description,
    thumbnailUrl: null,
    experienceCategory,
    boothSlot,
    acceptsFeedback: true,
    isPublished: true,
    feedbackCount,
    contactCount,
    interestCount,
  };
}

function feedback(id: string, projectId: string, content: string): Feedback {
  return {
    id,
    projectId,
    content,
    status: 'public',
    moderationReason: null,
    createdAt: '2026-06-09T12:00:00.000Z',
  };
}

function previewContacts(): readonly Contact[] {
  return previewProjects.slice(0, 4).map((projectItem, index) => ({
    id: `preview-contact-${index}`,
    projectId: projectItem.id,
    targetMemberUserId: index < 3 ? studentUser.id : 'preview-student-2',
    targetMemberUser: index < 3 ? studentUser : { ...studentUser, id: 'preview-student-2', name: '3508 김하린' },
    name: ['김민준', '이서연', '박지훈', '최하린'][index] ?? '담당자',
    organization: ['네이버 클라우드', '카카오 엔터프라이즈', '토스', '당근'][index] ?? '기업',
    position: '서비스 기획자',
    email: `contact${index + 1}@example.com`,
    phone: `010-0000-000${index}`,
    memo: `${projectItem.serviceName} 팀과 후속 미팅을 희망합니다.`,
    status: index % 2 === 0 ? 'new' : 'checked',
    createdAt: `2026-06-0${index + 1}T10:00:00.000Z`,
    project: projectItem,
  }));
}
