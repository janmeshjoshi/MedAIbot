import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AppointmentPage from "./pages/AppointmentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/appointment" element={<AppointmentPage/>} />
      </Routes>
    </Router>
  );
}

export default App;