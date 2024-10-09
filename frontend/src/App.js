import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';//stuck welad web eka
import HomePage from './Screens/HomePage/HomePage'; // Corrected
import AdminLogin from './Screens/Admin/AdminDashboard/AdminDashboard';
import { Provider } from 'react-redux';
import store from '../src/redux/store/store';
import LoginPage from './Screens/LoginScreen/LoginScreen';
import SignupPage from './Screens/SignUpScreen/SignUpScreen';


import CreatePremium from './CreatePremium';
import Premium from './premium';
import UpdatePremium from './UpdatePremium';
const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
       
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/homepage" element={<HomePage />} />
          
          <Route path="/create" element={<CreatePremium />} />
          <Route path="/update/:username" element={<UpdatePremium />} />

          <Route path="/premium" element={<Premium />} />
          <Route path="/user manager" element={<premium/>} />
          {/* <Route path="/adminLogin" element={<AdminLogin />} /> */}
          <Route path="/admin/dashboard" element={<AdminLogin />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App
