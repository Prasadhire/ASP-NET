import React from 'react';
import { Form } from 'react-bootstrap';

function PaymentMethodSelector({ value, onChange }) {
  return (
    <Form.Group>
      <Form.Label>Payment Method</Form.Label>
      <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select payment method</option>
        <option value="credit">Credit Card</option>
        <option value="debit">Debit Card</option>
        <option value="upi">UPI</option>
        <option value="netbanking">Net Banking</option>
      </Form.Select>
    </Form.Group>
  );
}

export default PaymentMethodSelector;
