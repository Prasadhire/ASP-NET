import React, { useState, useEffect } from 'react';
import './BusForm.css';

const BusForm = ({ bus, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    BusNumber: '',
    BusName: '',
    TotalSeats: 40,
    Type: 'AC',
    Status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bus) {
      setFormData({
        BusNumber: bus.BusNumber || '',
        BusName: bus.BusName || '',
        TotalSeats: bus.TotalSeats || 40,
        Type: bus.Type || 'AC',
        Status: bus.Status || 'Active'
      });
    }
  }, [bus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.BusNumber.trim()) {
      newErrors.BusNumber = 'Bus number is required';
    }

    if (!formData.BusName.trim()) {
      newErrors.BusName = 'Bus name is required';
    }

    if (!formData.TotalSeats || formData.TotalSeats < 1) {
      newErrors.TotalSeats = 'Total seats must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{bus ? 'Edit Bus' : 'Add New Bus'}</h3>
          <button type="button" className="close-btn" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bus-form">
          <div className="form-group">
            <label htmlFor="BusNumber">Bus Number *</label>
            <input
              type="text"
              id="BusNumber"
              name="BusNumber"
              className={`form-control ${errors.BusNumber ? 'is-invalid' : ''}`}
              value={formData.BusNumber}
              onChange={handleChange}
              placeholder="Enter bus number"
            />
            {errors.BusNumber && (
              <div className="invalid-feedback">{errors.BusNumber}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="BusName">Bus Name *</label>
            <input
              type="text"
              id="BusName"
              name="BusName"
              className={`form-control ${errors.BusName ? 'is-invalid' : ''}`}
              value={formData.BusName}
              onChange={handleChange}
              placeholder="Enter bus name"
            />
            {errors.BusName && (
              <div className="invalid-feedback">{errors.BusName}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="TotalSeats">Total Seats *</label>
              <input
                type="number"
                id="TotalSeats"
                name="TotalSeats"
                className={`form-control ${errors.TotalSeats ? 'is-invalid' : ''}`}
                value={formData.TotalSeats}
                onChange={handleChange}
                min="1"
                max="100"
              />
              {errors.TotalSeats && (
                <div className="invalid-feedback">{errors.TotalSeats}</div>
              )}
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="Type">Bus Type</label>
              <select
                id="Type"
                name="Type"
                className="form-control"
                value={formData.Type}
                onChange={handleChange}
              >
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="Status">Status</label>
            <select
              id="Status"
              name="Status"
              className="form-control"
              value={formData.Status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {bus ? 'Update Bus' : 'Create Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusForm;