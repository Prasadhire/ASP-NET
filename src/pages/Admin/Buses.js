import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BusForm from './BusForm';
import { adminApi } from '../../services/api';
import './Buses.css';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getBuses();
      setBuses(response.data);
    } catch (err) {
      setError('Failed to fetch buses');
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = () => {
    setEditingBus(null);
    setShowForm(true);
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setShowForm(true);
  };

  const handleDeleteBus = async (bus) => {
    if (window.confirm(`Are you sure you want to delete bus ${bus.BusName}?`)) {
      try {
        await adminApi.deleteBus(bus.BusID);
        fetchBuses(); // Refresh data
      } catch (err) {
        setError('Failed to delete bus');
      }
    }
  };

  const handleFormSubmit = async (busData) => {
    try {
      if (editingBus) {
        await adminApi.updateBus(editingBus.BusID, busData);
      } else {
        await adminApi.createBus(busData);
      }
      setShowForm(false);
      setEditingBus(null);
      fetchBuses(); // Refresh data
    } catch (err) {
      setError(`Failed to ${editingBus ? 'update' : 'create'} bus`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBus(null);
  };

  const busColumns = [
    {
      key: 'BusID',
      header: 'Bus ID',
      minWidth: '100px'
    },
    {
      key: 'BusNumber',
      header: 'Bus Number',
      minWidth: '120px'
    },
    {
      key: 'BusName',
      header: 'Bus Name'
    },
    {
      key: 'TotalSeats',
      header: 'Seats',
      minWidth: '80px'
    },
    {
      key: 'Type',
      header: 'Type',
      render: (value) => (
        <span className={`bus-type ${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },
    {
      key: 'Status',
      header: 'Status',
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  if (loading) return <LoadingSpinner text="Loading buses..." />;

  return (
    <div className="buses-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Bus Management</h2>
            <p>Manage your fleet of buses</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleAddBus}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Bus
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="buses-content">
        <DataTable
          columns={busColumns}
          data={buses}
          keyField="BusID"
          onEdit={handleEditBus}
          onDelete={handleDeleteBus}
          searchable={true}
          pagination={true}
        />
      </div>

      {showForm && (
        <BusForm
          bus={editingBus}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Buses;