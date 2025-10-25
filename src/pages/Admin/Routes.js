import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RouteStopsModal from '../../components/admin/RouteStopsModal';
import { adminApi } from '../../services/api';
import './Routes.css';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      // Note: You might need to create this API endpoint
      const buses = await adminApi.getBuses();
      const routesWithDetails = buses.data.flatMap(bus => 
        bus.Routes?.map(route => ({
          ...route,
          BusName: bus.BusName,
          BusNumber: bus.BusNumber
        })) || []
      );
      setRoutes(routesWithDetails);
    } catch (err) {
      setError('Failed to fetch routes');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoute = (route) => {
    setSelectedRoute(route);
  };

  const handleCloseModal = () => {
    setSelectedRoute(null);
  };

  const handleEditRoute = (route) => {
    console.log('Edit route:', route);
    // Implement route editing
  };

  const handleDeleteRoute = async (route) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        // Implement route deletion API
        console.log('Delete route:', route);
        fetchRoutes(); // Refresh data
      } catch (err) {
        setError('Failed to delete route');
      }
    }
  };

  const routeColumns = [
    {
      key: 'RouteID',
      header: 'Route ID',
      minWidth: '100px'
    },
    {
      key: 'Bus',
      header: 'Bus',
      render: (value, item) => (
        <div>
          <div><strong>{item.BusName}</strong></div>
          <small className="text-muted">{item.BusNumber}</small>
        </div>
      )
    },
    {
      key: 'Source',
      header: 'Source'
    },
    {
      key: 'Destination',
      header: 'Destination'
    },
    {
      key: 'Stops',
      header: 'Stops',
      render: (value) => value?.length || 0
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, item) => (
        <div>
          <button 
            className="btn btn-sm btn-info me-1"
            onClick={() => handleViewRoute(item)}
            title="View Stops"
          >
            <i className="fas fa-map-marker-alt"></i> Stops
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner text="Loading routes..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <AdminLayout 
      title="Routes Management"
      subtitle="Manage bus routes and stops"
    >
      <div className="routes-content">
        <DataTable
          columns={routeColumns}
          data={routes}
          keyField="RouteID"
          onView={handleViewRoute}
          onEdit={handleEditRoute}
          onDelete={handleDeleteRoute}
          searchable={true}
          pagination={true}
        />
      </div>

      {selectedRoute && (
        <RouteStopsModal 
          route={selectedRoute}
          onClose={handleCloseModal}
        />
      )}
    </AdminLayout>
  );
};

export default Routes;