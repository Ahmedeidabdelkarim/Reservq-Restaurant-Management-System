import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Row, Spinner, Image } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaEnvelope } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomerManagement.css";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for viewing customer details
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);

  // Modal state for editing a customer
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/customers`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assuming the API returns an object with a data property containing the customers array
        const customersData = data.data || data;
        
        setCustomers(customersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // View Modal handlers
  const handleViewModalShow = (customer) => {
    setViewCustomer(customer);
    setShowViewModal(true);
  };

  const handleViewModalClose = () => {
    setViewCustomer(null);
    setShowViewModal(false);
  };

  // Edit Modal handlers
  const handleEditModalShow = (customer) => {
    setEditCustomer({...customer});
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setEditCustomer(null);
    setShowEditModal(false);
  };

  const handleEditSave = async () => {
    try {
      // You would typically send an API request to update the customer
      // For now, we're just updating the local state
      setCustomers(
        customers.map((cust) =>
          cust.id === editCustomer.id ? editCustomer : cust
        )
      );
      handleEditModalClose();
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer. Please try again.");
    }
  };

  // Delete handler
  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        // You would typically send an API request to delete the customer
        // For now, we're just updating the local state
        setCustomers(customers.filter((cust) => cust.id !== customerId));
      } catch (err) {
        console.error("Error deleting customer:", err);
        alert("Failed to delete customer. Please try again.");
      }
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mx-3">
        <div className="customer">
          <h2 className="py-2 text-start">Customer Management</h2>
          
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Date Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>{index + 1}</td>
                    <td>
                      {customer.profileImage ? (
                        <Image 
                          src={customer.profileImage} 
                          roundedCircle 
                          width="40" 
                          height="40"
                          alt={`${customer.firstName} ${customer.lastName}`}
                          onError={(e) => {e.target.src = "https://via.placeholder.com/40"}}
                        />
                      ) : (
                        <div className="text-center">-</div>
                      )}
                    </td>
                    <td>{`${customer.firstName || ''} ${customer.lastName || ''}`}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td>{customer.orders || 0}</td>
                    <td>${(customer.TotalSpent || 0).toFixed(2)}</td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm" 
                        className="me-1 py-2"
                        onClick={() => handleViewModalShow(customer)}
                      >
                        <FaEye /> View
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-1 py-2"
                        onClick={() => handleEditModalShow(customer)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-1 py-2 px-2"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* View Customer Modal */}
          <Modal show={showViewModal} onHide={handleViewModalClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Customer Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewCustomer && (
                <div className="customer-details">
                  <div className="text-center mb-4">
                    {viewCustomer.profileImage ? (
                      <Image 
                        src={viewCustomer.profileImage} 
                        roundedCircle 
                        width="100" 
                        height="100"
                        alt={`${viewCustomer.firstName} ${viewCustomer.lastName}`}
                        onError={(e) => {e.target.src = "https://via.placeholder.com/100"}}
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                    <h4 className="mt-2">{`${viewCustomer.firstName || ''} ${viewCustomer.lastName || ''}`}</h4>
                  </div>
                  
                  <Row className="mb-3">
                    <div className="col-md-6">
                      <p><strong>Email:</strong> {viewCustomer.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {viewCustomer.phone || 'N/A'}</p>
                      <p><strong>Location:</strong> {viewCustomer.city ? `${viewCustomer.city}, ${viewCustomer.state}, ${viewCustomer.country}` : 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Orders:</strong> {viewCustomer.orders || 0}</p>
                      <p><strong>Total Spent:</strong> ${(viewCustomer.TotalSpent || 0).toFixed(2)}</p>
                      <p><strong>Customer Since:</strong> {formatDate(viewCustomer.createdAt)}</p>
                      <p><strong>Last Updated:</strong> {formatDate(viewCustomer.updatedAt)}</p>
                    </div>
                  </Row>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleViewModalClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Customer Modal */}
          <Modal show={showEditModal} onHide={handleEditModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editCustomer && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCustomer.firstName || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCustomer.lastName || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={editCustomer.email || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCustomer.phone || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          phone: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCustomer.country || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          country: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCustomer.state || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          state: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCustomer.city || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          city: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleEditModalClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Row>
    </Container>
  );
};

export default CustomerManagement;