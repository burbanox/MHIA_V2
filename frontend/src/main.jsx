import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import LogInPage from "./pages/LogIn.jsx";
import SelectPatient from "./pages/SelectPatient.jsx";
import SignUp from "./pages/SignUp.jsx";
import PatientSessions from "./pages/PatientSessions.jsx"; // <--- CAMBIADO
import CreatePatient from "./pages/CreatePatient.jsx";
import CreateSession from "./pages/CreateSession.jsx";
import Session from "./pages/Session.jsx";
import EditPatient from "./pages/EditPatient.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/LogIn" element={<LogInPage />} />
        <Route path="/SignUp" element={<SignUp/>} />
        <Route path="/patients" element={<SelectPatient />} />
        <Route path="/sessions/:patientDocumentId" element={<PatientSessions />} />         
        <Route path="/create-patient" element={<CreatePatient />} />
        <Route path="/create-session/:patientDocumentId" element={<CreateSession />} />
        <Route path="/session/:sessionId" element={<Session />} />
        <Route path="/edit-patient/:patientId" element={<EditPatient />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);