import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Nav, Modal, Button } from "react-bootstrap";
import { NavLink, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import {
  LayoutDashboard, ShoppingBag, Utensils, Users, CreditCard, List, FileText, BarChart, Tag, LogOut,CalendarCheck
} from "lucide-react"; // Icons

import Dashboard from "./Components/Dashboard/Dashboard";
import Order from "./Components/Order/Order";
import MenuManagement from "./Components/Menumanagement/MenuManagement";
import CustomerManagement from "./Components/CustomerManagement/CustomerManagement";
import ReservationManagement from "./Components/ReservationManagment/ReservationManagment";
//import PaymentManagement from "./Components/PaymentMethod/PaymentManagement";
import Categories from "./Components/Categories/Categories";
import Posts from "./Components/Posts/Posts";
import Descont from "./Components/Descont/Descont";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // Redirect non-admins
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    navigate("/login");
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidepanel">
          <div className="p-3 vh-100 insideside text-start">
            <h4 className="mb-4">Admin Panel</h4>
            <Nav className="flex-column">
              <NavLink to="/admin/dashboard" className="nav-item">
                <LayoutDashboard size={20} className="me-2" /> Dashboard
              </NavLink>
              <NavLink to="/admin/orders" className="nav-item">
                <ShoppingBag size={20} className="me-2" /> Orders
              </NavLink>
              <NavLink to="/admin/menu" className="nav-item">
                <Utensils size={20} className="me-2" /> Menu
              </NavLink>
              <NavLink to="/admin/customers" className="nav-item">
                <Users size={20}  className="me-2" /> Customers
              </NavLink>
              <NavLink to="/admin/Reservations" className="nav-item">
                <CalendarCheck size={20}  className="me-2" /> Reservations
              </NavLink>
              <NavLink to="/admin/categories" className="nav-item">
                <List size={20} className="me-2" /> Categories
              </NavLink>
              <NavLink to="/admin/posts" className="nav-item">
                <FileText size={20} className="me-2" /> Blogs
              </NavLink>
              <NavLink to="/admin/discounts" className="nav-item">
                <Tag size={20} className="me-2" /> Discounts
              </NavLink>
              <Nav.Link onClick={() => setShowLogoutModal(true)} className="p-2">
                <LogOut size={20} className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Content Area */}
        <Col md={10} className="p-1 content-area">
          <Routes>
            {/* Redirect from /admin to /admin/dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/menu" element={<MenuManagement/>} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/Reservations" element={<ReservationManagement />} />      
            <Route path="/categories" element={<Categories/>} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/discounts" element={<Descont />} />
          </Routes>
        </Col>
      </Row>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <FaSignOutAlt size={50} className="text-danger mb-3" />
          <h5>Are you sure you want to logout?</h5>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button className="py-3 px-3" variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
          <Button className="py-3 px-3" variant="danger" onClick={handleLogout}>Logout</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
