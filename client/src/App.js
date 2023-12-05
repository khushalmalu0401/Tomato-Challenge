import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import Home from "./components/Common/Home";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Contact from "./components/Common/Contact";
import About from "./components/Common/About/About";
import PageNotFound from "./components/Common/PageNotFound/PageNotFound";

import Login from "./components/Farmer/Login";
import Signup from "./components/Farmer/Signup";
import FarmerDashboard from "./components/Farmer/Dashboard";
import FarmerApmcList from "./components/Farmer/ApmcList";

import ApmcLogin from "./components/Apmc/Login";
import Farmerdata from "./components/Apmc/Dashboard";
import Form from "./components/Apmc/AddFarmerTransactions";
import ApmcRegister from "./components/Apmc/Register";
import FarmerTransactions from "./components/Farmer/FarmerTransactions";
import ApmcTomatoReq from "./components/Apmc/ReceivedRequestApmc";
import RequestOtherApmc from "./components/Apmc/RequestOtherApmc";
import ApmcTomatoReqList from "./components/Apmc/TomatoRequested";
import FullFilledRequest from "./components/Apmc/FullfilledRequest";
import ApmcFarmerTransactions from "./components/Apmc/FarmerTransactions"

import AdminNavbar from "./components/Admin/Navbar";
import AdminDashboard from "./components/Admin/Dashboard";
import AdminLogin from "./components/Admin/Login";
import AdminRegister from "./components/Admin/Register";

import VendorLogin from "./components/Vendor/VendorLogin";
import VendorRegister from "./components/Vendor/VendorRegister";
import ApmcList from "./components/Vendor/ApmcList";
import VendorTomatoReq from "./components/Vendor/VendorTomatoReq";

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
        <Route path="/apmc/fullfilledRequest" element={<FullFilledRequest />} />
        <Route path="/apmc/farmerTransactions" element={<ApmcFarmerTransactions />} />



        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/transactions" element={<FarmerTransactions />} />
        <Route path="/farmer/apmcList" element={<FarmerApmcList />} />

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
