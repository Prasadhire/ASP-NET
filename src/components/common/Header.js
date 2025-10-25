import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { admin, conductor, logoutAdmin, logoutConductor } = useAuth();

  const handleLogout = () => {
    if (admin) logoutAdmin();
    if (conductor) logoutConductor();
    navigate('/');
  };

  const getWelcomeText = () => {
    if (admin) return `Welcome, ${admin.fullName}`;
    if (conductor) return `Welcome, ${conductor.fullName}`;
    return null;
  };

  return (
    <Navbar bg="white" expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <div className="brand-logo">
            <i className="fas fa-bus"></i>
            <span>TravelBus</span>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className="nav-link-custom">
              Book Tickets
            </Nav.Link>
            <Nav.Link as={Link} to="/my-bookings" className="nav-link-custom">
              My Bookings
            </Nav.Link>
            
            {/* Admin Only Links */}
            {admin && (
              <Nav.Link as={Link} to="/admin/dashboard" className="nav-link-custom">
                Admin Dashboard
              </Nav.Link>
            )}
            
            {/* Conductor Only Links */}
            {conductor && (
              <Nav.Link as={Link} to="/conductor/dashboard" className="nav-link-custom">
                Conductor Panel
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {getWelcomeText() && (
              <span className="navbar-text me-3 text-primary fw-bold">
                <i className="fas fa-user me-1"></i>
                {getWelcomeText()}
              </span>
            )}
            
            {admin || conductor ? (
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                  <i className="fas fa-user-circle me-2"></i>
                  Account
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={admin ? "/admin/dashboard" : "/conductor/dashboard"}>
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button 
                  variant="outline-primary" 
                  className="me-2 admin-btn"
                  onClick={() => navigate('/admin/login')}
                >
                  <i className="fas fa-user-shield me-2"></i>
                  Admin
                </Button>
                <Button 
                  variant="outline-success" 
                  className="conductor-btn"
                  onClick={() => navigate('/conductor/login')}
                >
                  <i className="fas fa-clipboard-list me-2"></i>
                  Conductor
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;