import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaUser, FaShoppingBag, FaHistory, FaCog } from 'react-icons/fa';
import AddressManagement from './AddressManagement';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = `${process.env.REACT_APP_URL}/api/v1`;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
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
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-section">
            <h3 className="mb-4">Profile Information</h3>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : userData ? (
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={4} className="text-center mb-4">
                      <div className="profile-image mb-3">
                        <FaUser size={80} className="text-primary" />
                      </div>
                      <h4>{userData.firstName} {userData.lastName}</h4>
                      <p className="text-muted">{userData.email}</p>
                    </Col>
                    <Col md={8}>
                      <div className="profile-details">
                        <h5>Contact Information</h5>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone || 'Not provided'}</p>
                        <p><strong>Country:</strong> {userData.country || 'Not provided'}</p>
                        <p><strong>City:</strong> {userData.city || 'Not provided'}</p>
                        <p><strong>State:</strong> {userData.state || 'Not provided'}</p>
                        <p><strong>Address:</strong> {userData.address || 'Not provided'}</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : null}
          </div>
        );
      case 'addresses':
        return <AddressManagement />;
      case 'orders':
        return (
          <div className="orders-section">
            <h3 className="mb-4">Order History</h3>
            <Alert variant="info">
              Order history feature coming soon!
            </Alert>
          </div>
        );
      case 'settings':
        return (
          <div className="settings-section">
            <h3 className="mb-4">Account Settings</h3>
            <Alert variant="info">
              Account settings feature coming soon!
            </Alert>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex flex-column">
                <Button
                  variant={activeTab === 'profile' ? 'primary' : 'outline-primary'}
                  className="mb-2 text-start"
                  onClick={() => handleTabChange('profile')}
                >
                  <FaUser className="me-2" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === 'addresses' ? 'primary' : 'outline-primary'}
                  className="mb-2 text-start"
                  onClick={() => handleTabChange('addresses')}
                >
                  <FaShoppingBag className="me-2" />
                  Addresses
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'primary' : 'outline-primary'}
                  className="mb-2 text-start"
                  onClick={() => handleTabChange('orders')}
                >
                  <FaHistory className="me-2" />
                  Order History
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'primary' : 'outline-primary'}
                  className="text-start"
                  onClick={() => handleTabChange('settings')}
                >
                  <FaCog className="me-2" />
                  Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 