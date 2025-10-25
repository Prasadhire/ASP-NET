import React from 'react';
import { Container } from 'react-bootstrap';
import AdminSidebar from '../admin/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children, title, subtitle }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="page-header">
          <Container>
            <h2>{title}</h2>
            {subtitle && <p className="mb-0">{subtitle}</p>}
          </Container>
        </div>
        <Container className="py-4">
          {children}
        </Container>
      </main>
    </div>
  );
};

export default AdminLayout;
