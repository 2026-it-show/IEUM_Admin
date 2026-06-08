import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components'; // 💡 ThemeProvider 임포트 추가
import { GlobalStyle, theme } from './styles'; // 💡 안전하게 상대 경로로 수정 (필요시 @/styles로 유지 가능)
import Login from './pages/Home/Login';
import StudentHome from './pages/Student/StudentHome';
import TeacherHome from './pages/Teacher/TeacherHome';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/teacher/home" element={<TeacherHome />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;