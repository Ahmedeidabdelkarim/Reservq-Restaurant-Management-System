import React, { useState, useEffect } from 'react';
import {Container,Table,Button,Form,Row,Col,Modal} from 'react-bootstrap';
import {Trash3,PencilSquare,Search,Funnel,} from 'react-bootstrap-icons';
import './ReservationManagment.css';
import { toast } from 'react-toastify';
import { set } from 'react-hook-form';
const ReservationManagement = () => {
  const API_URL = `${process.env.REACT_APP_URL}/api/v1`;
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log(API_URL)
        const response = await fetch(`${API_URL}/reservations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); 
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data);
        setFiltered(data);
      } catch (error) {
        console.log(error)
        toast.error('failed to load reservations');
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    let result = reservations;

    if (searchTerm) {
      result = result.filter(
        (res) =>
          res.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.profile.phone.includes(searchTerm)
      );
    }

    if (filterDate) {
      result = result.filter((res) => res.date === filterDate);
    }

    setFiltered(result);
  }, [searchTerm, filterDate, reservations]);

  const handleCancel = async (id) => {
    if (!id) return;
    try {
    const response = await fetch(`${API_URL}/reservation/${id}`, {
      headers:{
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      method:"DELETE"
    })
    if (!response.ok) {
      console.error("Failed to delete reservation");
      toast.error("Failed to delete reservation");
      return;
    }
    const updated = reservations.filter((res) => res.id !== id);
    setReservations(updated);
    toast.success("Reservation deleted successfully");


    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
    }
  };
  

  const handleEdit = (reservation) => {
    setEditing(reservation);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    console.log(editing)
    const response = await fetch(`${API_URL}/reservation/${editing.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({date:editing.data,hour:editing.hour,location:editing.location,numberOfGuests:editing.numberOfGuests}),
    });
    if (!response.ok) {
      console.error("Failed to update reservation");
      toast.error("Failed to update reservation");
      setShowModal(false);
      return;
    }
    const data = await response.json();
    console.log(data)
    const updated = reservations.map((res) =>
      res.id === editing.id ? editing : res
    );
    setReservations(updated);
    setShowModal(false);
  };

  return (
    <Container className="py-2">
      <h2 className="mb-4 text-start">Reservation Management</h2>

      <Row className="mb-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button  className="w-100 colorclear" onClick={() => {
            setSearchTerm('');
            setFilterDate('');
          }}>
            <Funnel className="me-1" />
            Clear Filters
          </Button>
        </Col>
      </Row>

      <Table responsive bordered hover>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Party Size</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((res) => (
              <tr key={res.id}>
                <td>{res.profile.firstName} {res.profile.lastName}</td>
                <td>{res.profile.email}</td>
                <td>{res.profile.phone}</td>
                <td>{res.date}</td>
                <td>{res.hour}</td>
                <td>{res.numberOfGuests}</td>
                <td>{res.location}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2 coloredit p-2"
                    onClick={() => handleEdit(res)}
                  >
                    <PencilSquare className="me-1" />
                    Edit
                  </Button>
                  <Button
                  variant="danger"
                  size="sm"
                  className="p-2"
                  onClick={() => handleCancel(res.id)}
                    >
                     <Trash3 className="me-1" />
                     Cancel
                    </Button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-muted text-center py-3">
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={`${editing.profile.firstName} ${editing.profile.lastName}`}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editing.profile.email}
                 disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={editing.profile.phone}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hour</Form.Label>
                <Form.Control
                  type="text"
                  value={editing.hour}
                  onChange={(e) =>
                    setEditing({ ...editing, hour: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Party Size</Form.Label>
                <Form.Control
                  type="number"
                  value={editing.numberOfGuests}
                  onChange={(e) =>
                    setEditing({ ...editing, numberOfGuests: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Select
                  value={editing.location}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                >
                  <option>Indoor</option>
                  <option>Outdoor</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservationManagement;
