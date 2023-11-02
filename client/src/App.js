import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
// import Home from "./components/Home/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Contact from "./components/Contact";
import PageNotFound from "./components/PageNotFound";
import About from "./components/About";
import "react-toastify/dist/ReactToastify.css";
import Farmerdata from "./components/ApmcDashboard";
import Form from "./components/Form";
import Footer from "./components/Footer";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import AdminNavbar from "./components/AdminNavbar";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ApmcLogin from "./components/ApmcLogin";
import ApmcRegister from "./components/ApmcRegister";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import FarmerTransactions from "./components/FarmerTransactions";
import VendorLogin from "./components/VendorLogin";
import VendorRegister from "./components/VendorRegister";
import ApmcList from "./components/ApmcList";
import ApmcTomatoReq from "./components/ApmcTomatoReq";
import VendorTomatoReq from "./components/VendorTomatoReq";
import RequestOtherApmc from "./components/RequestOtherApmc";
import ApmcTomatoReqList from "./components/ApmcTomatoReqList";

const App = () => {
  return (
    <>
      {/* {role === "admin" ? <AdminNavbar /> : <Navbar role setRole/>} */}
      <Navbar />
      <Routes>
        {/* Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route exact path="/apmc/login" element={<ApmcLogin />} />
        <Route exact path="/apmc/register" element={<ApmcRegister />} />

        <Route exact path="/admin" element={<AdminLogin />} />
        <Route exact path="/admin/register" element={<AdminRegister />} />

        <Route exact path="/vendor/login" element={<VendorLogin />} />
        <Route exact path="/vendor/register" element={<VendorRegister />} />

        {/* Default Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<PageNotFound />} />

        {/* APMC Route */}
        <Route path="/apmc/addSupply" element={<Form />} />
        <Route path="/apmc/dashboard" element={<Farmerdata />} />
        <Route path="/apmc/tomatoRequest" element={<ApmcTomatoReq />} />
        <Route path="/apmc/requestOtherApmc" element={<RequestOtherApmc />} />
        <Route path="/apmc/tomatoRequested" element={<ApmcTomatoReqList />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Farmer Routes */}
        <Route path="/farmer/transactions" element={<FarmerTransactions />} />

        {/* Vendor Routes */}
        <Route exact path="/apmc/list" element={<ApmcList />} />
        <Route
          exact
          path="/vendor/tomatoRequested"
          element={<VendorTomatoReq />}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
