import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/homepage";
import AboutPage from './pages/about';
import ContactPage from './pages/contact';
import NotFoundPage from "./pages/errorPage";
import ResetPasswordPage from './components/auth/resetPassword';
import ForgotPasswordPage from './components/auth/forgotPassword';
import AuthPage from './components/auth/authenticate';


function App() {

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
