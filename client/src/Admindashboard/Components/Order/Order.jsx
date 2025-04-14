import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Order.css";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form state for updating orders
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
  });

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/v1/orders`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch orders: ${err.message}`);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single order details
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/v1/order/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setSelectedOrder(data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error(`Failed to fetch order ${orderId}:`, err);
      alert(`Failed to fetch order details: ${err.message}`);
    }
  };

  // Update order status and payment status
  const updateOrder = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/v1/order/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            status: formData.status,
            paymentStatus: formData.paymentStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: formData.status,
                paymentStatus: formData.paymentStatus,
              }
            : order
        )
      );

      setShowEditModal(false);
      alert("Order updated successfully!");
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
      alert(`Failed to update order: ${err.message}`);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/v1/order/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Remove from local state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      setShowDeleteModal(false);
      alert("Order deleted successfully!");
    } catch (err) {
      console.error(`Failed to delete order ${orderId}:`, err);
      alert(`Failed to delete order: ${err.message}`);
    }
  };

  // Quick status update
  const quickUpdateStatus = async (orderId, newStatus) => {
    try {
      // Update UI optimistically
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Send update to API
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/v1/order/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
        // In a real app, you'd revert the optimistic update here
      }
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
      alert(`Failed to update order status: ${err.message}`);
      fetchOrders(); // Refresh data to ensure UI is in sync with backend
    }
  };

  // Open edit modal with current order data
  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
    setShowEditModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  // Get badge class for order status
  const getOrderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success";
      case "processing":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Get badge class for payment status
  const getPaymentStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <Row>
        <Col md={10} className="m-auto w-100">
          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <div className="text-start">
                    <Card.Title className="text-start fs-2">
                      Order Management
                    </Card.Title>
                    <Button className="my-1" variant="danger" onClick={fetchOrders}>
                      Refresh Orders
                    </Button>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    <>
                      <h5 className="text-start my-3">
                        Active Orders ({orders.length})
                      </h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ORDER ID</th>
                            <th>DATE</th>
                            <th>ADDRESS</th>
                            <th>AMOUNT</th>
                            <th>PAYMENT METHOD</th>
                            <th>PAYMENT STATUS</th>
                            <th>ORDER STATUS</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length > 0 ? (
                            orders.map((order) => (
                              <tr key={order.id}>
                                <td>
                                  {order.id.substring(order.id.length - 8)}
                                </td>
                                <td>{formatDate(order.date)}</td>
                                <td>{order.address}</td>
                                <td>{formatCurrency(order.total)}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                  <span
                                    className={`badge bg-${getPaymentStatusBadge(
                                      order.paymentStatus
                                    )}`}
                                  >
                                    {order.paymentStatus}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${getOrderStatusBadge(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex flex-nowrap">
                                    <Button
                                      variant="info"
                                      size="sm"
                                      className="me-1"
                                      onClick={() =>
                                        fetchOrderDetails(order.id)
                                      }
                                    >
                                      View
                                    </Button>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      className="me-1"
                                      onClick={() => openEditModal(order)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => openDeleteModal(order)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                  {/* <div className="mt-2">
                                    <div className="btn-group">
                                      <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-1"
                                        onClick={() =>
                                          quickUpdateStatus(
                                            order.id,
                                            "processing"
                                          )
                                        }
                                        disabled={order.status === "processing"}
                                      >
                                        Process
                                      </Button>
                                      <Button
                                        variant="outline-success"
                                        size="sm"
                                        className="me-1"
                                        onClick={() =>
                                          quickUpdateStatus(
                                            order.id,
                                            "delivered"
                                          )
                                        }
                                        disabled={order.status === "delivered"}
                                      >
                                        Deliver
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                          quickUpdateStatus(
                                            order.id,
                                            "cancelled"
                                          )
                                        }
                                        disabled={order.status === "cancelled"}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div> */}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Edit Order Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Order ID</Form.Label>
                <Form.Control type="text" value={selectedOrder.id} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Order Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleFormChange}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => updateOrder(selectedOrder.id)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this order?
          {selectedOrder && (
            <div className="mt-3">
              <strong>Order ID:</strong> {selectedOrder.id}
              <br />
              <strong>Total:</strong> {formatCurrency(selectedOrder.total)}
              <br />
              <strong>Date:</strong> {formatDate(selectedOrder.date)}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteOrder(selectedOrder.id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Order Information</h5>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedOrder.date)}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ms-2 badge bg-${getOrderStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total:</strong>{" "}
                    {formatCurrency(selectedOrder.total)}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <p>
                    <strong>User ID:</strong> {selectedOrder.userId}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.address}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span
                      className={`ms-2 badge bg-${getPaymentStatusBadge(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </Col>
              </Row>

              <h5>Order Items</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products &&
                  selectedOrder.products.length > 0 ? (
                    selectedOrder.products.map((product, index) => (
                      <tr key={`${product.id}-${index}`}>
                        <td>{product.id}</td>
                        <td>{product.quantity}</td>
                        <td>{product.discount}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="mt-4">
                <h5>Actions</h5>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowDetailsModal(false);
                      openEditModal(selectedOrder);
                    }}
                  >
                    Edit Order
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => {
                      quickUpdateStatus(selectedOrder.id, "delivered");
                      setShowDetailsModal(false);
                    }}
                    disabled={selectedOrder.status === "delivered"}
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      updateOrder(selectedOrder.id, { paymentStatus: "paid" });
                      setShowDetailsModal(false);
                    }}
                    disabled={selectedOrder.paymentStatus === "paid"}
                  >
                    Mark as Paid
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowDetailsModal(false);
                      openDeleteModal(selectedOrder);
                    }}
                  >
                    Delete Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
