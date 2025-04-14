import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaShippingFast } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const AddressManagement = () => {
  // State for billing address (from API)
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    phone: '',
  });

  // State for shipping address (from localStorage)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    phone: '',
  });

  // Modal states
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  
  // Form states
  const [editedBillingAddress, setEditedBillingAddress] = useState({});
  const [editedShippingAddress, setEditedShippingAddress] = useState({});

  // Message states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // API base URL
  const API_BASE_URL = `${process.env.REACT_APP_URL}/api/v1`;

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
    // Load shipping address from localStorage
    const savedShippingAddress = localStorage.getItem('shippingAddress');
    if (savedShippingAddress) {
      setShippingAddress(JSON.parse(savedShippingAddress));
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile data');
      }

      const data = await response.json();
      
      // Update billing address with API data
      const newBillingAddress = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        address: data.address || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        phone: data.phone || '',
      };

      setBillingAddress(newBillingAddress);
      setEditedBillingAddress(newBillingAddress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleUpdateBillingAddress = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Validate required fields
      if (!editedBillingAddress.firstName || !editedBillingAddress.lastName || !editedBillingAddress.address) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(editedBillingAddress)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Update the billing address state with the edited data
      setBillingAddress(editedBillingAddress);
      setSuccessMessage('Profile updated successfully!');
      setShowBillingModal(false);
      
      // Wait for 1.5 seconds to show the success message before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShippingAddress = () => {
    try {
      // Validate required fields
      if (!editedShippingAddress.firstName || !editedShippingAddress.lastName || !editedShippingAddress.address) {
        throw new Error('Please fill in all required fields');
      }

      setShippingAddress(editedShippingAddress);
      localStorage.setItem('shippingAddress', JSON.stringify(editedShippingAddress));
      setSuccessMessage('Shipping address updated successfully!');
      setShowShippingModal(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCloseModals = () => {
    setShowBillingModal(false);
    setShowShippingModal(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Address Management</h2>
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          {errorMessage}
        </Alert>
      )}
      
      <Row>
        {/* Billing Address Card */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <MdLocationOn className="me-2" />
                Billing Address
              </div>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => {
                  setEditedBillingAddress(billingAddress);
                  setShowBillingModal(true);
                }}
                disabled={loading}
              >
                <FaEdit /> Edit
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p><strong>Name:</strong> {billingAddress.firstName} {billingAddress.lastName}</p>
                  <p><strong>Address:</strong> {billingAddress.address}</p>
                  <p><strong>Location:</strong> {billingAddress.city}, {billingAddress.state}, {billingAddress.country}</p>
                  <p><strong>Phone:</strong> {billingAddress.phone || 'Not provided'}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Shipping Address Card */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <FaShippingFast className="me-2" />
                Shipping Address
              </div>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => {
                  setEditedShippingAddress(shippingAddress);
                  setShowShippingModal(true);
                }}
              >
                <FaEdit /> Edit
              </Button>
            </Card.Header>
            <Card.Body>
              {Object.keys(shippingAddress).length > 0 ? (
                <>
                  <p><strong>Name:</strong> {shippingAddress.firstName} {shippingAddress.lastName}</p>
                  <p><strong>Address:</strong> {shippingAddress.address}</p>
                  <p><strong>Location:</strong> {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.country}</p>
                  <p><strong>Phone:</strong> {shippingAddress.phone || 'Not provided'}</p>
                </>
              ) : (
                <p className="text-muted">No shipping address saved. Click edit to add one.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Billing Address Modal */}
      <Modal show={showBillingModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Billing Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedBillingAddress.firstName || ''}
                    onChange={(e) => setEditedBillingAddress({
                      ...editedBillingAddress,
                      firstName: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedBillingAddress.lastName || ''}
                    onChange={(e) => setEditedBillingAddress({
                      ...editedBillingAddress,
                      lastName: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                type="text"
                value={editedBillingAddress.address || ''}
                onChange={(e) => setEditedBillingAddress({
                  ...editedBillingAddress,
                  address: e.target.value
                })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedBillingAddress.country || ''}
                    onChange={(e) => setEditedBillingAddress({
                      ...editedBillingAddress,
                      country: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedBillingAddress.state || ''}
                    onChange={(e) => setEditedBillingAddress({
                      ...editedBillingAddress,
                      state: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedBillingAddress.city || ''}
                    onChange={(e) => setEditedBillingAddress({
                      ...editedBillingAddress,
                      city: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={editedBillingAddress.phone || ''}
                onChange={(e) => setEditedBillingAddress({
                  ...editedBillingAddress,
                  phone: e.target.value
                })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateBillingAddress}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Shipping Address Modal */}
      <Modal show={showShippingModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Shipping Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedShippingAddress.firstName || ''}
                    onChange={(e) => setEditedShippingAddress({
                      ...editedShippingAddress,
                      firstName: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedShippingAddress.lastName || ''}
                    onChange={(e) => setEditedShippingAddress({
                      ...editedShippingAddress,
                      lastName: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                type="text"
                value={editedShippingAddress.address || ''}
                onChange={(e) => setEditedShippingAddress({
                  ...editedShippingAddress,
                  address: e.target.value
                })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedShippingAddress.country || ''}
                    onChange={(e) => setEditedShippingAddress({
                      ...editedShippingAddress,
                      country: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedShippingAddress.state || ''}
                    onChange={(e) => setEditedShippingAddress({
                      ...editedShippingAddress,
                      state: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedShippingAddress.city || ''}
                    onChange={(e) => setEditedShippingAddress({
                      ...editedShippingAddress,
                      city: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={editedShippingAddress.phone || ''}
                onChange={(e) => setEditedShippingAddress({
                  ...editedShippingAddress,
                  phone: e.target.value
                })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateShippingAddress}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddressManagement; 