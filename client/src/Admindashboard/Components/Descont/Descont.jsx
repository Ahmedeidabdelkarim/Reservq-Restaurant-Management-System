import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row } from "react-bootstrap";
import { Trash, Edit, Plus } from "lucide-react";
import { toast } from "react-toastify";
import "./Descont.css";

const API_URL = `${process.env.REACT_APP_URL}/api/v1`;

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    id: "",
    discountCode: "",
    discountPercentage: "",
    validFrom: "",
    validTo: "",
    isActive: false
  });
  const [editingPromotion, setEditingPromotion] = useState(null);

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${API_URL}/discounts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch promotions");

        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        toast.error("Failed to load promotions.");
      }
    };

    fetchPromotions();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    if (e.target.name === "isActive") {
      setNewPromotion((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
      return;
    }
    const { name, value } = e.target;
    setNewPromotion((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update a promotion
  const addOrUpdatePromotion = async () => {
    if (
      !newPromotion.discountCode ||
      !newPromotion.discountPercentage ||
      !newPromotion.validFrom ||
      !newPromotion.validTo
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (new Date(newPromotion.validFrom) > new Date(newPromotion.validTo)) {
      toast.error("Invalid date range.");
      return;
    }

    try {
      const method = editingPromotion ? "PATCH" : "POST";
      const url = editingPromotion
        ? `${API_URL}/discount/${editingPromotion.id}`
        : `${API_URL}/discount/add`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPromotion),
      });

      if (!response.ok)
        throw new Error(`Failed to ${editingPromotion ? "update" : "create"} promotion`);

      // Update the promotions list
      const updatedData = await response.json();
      console.log(updatedData);
      setPromotions((prev) =>
        editingPromotion
          ? prev.map((p) => (p.id === editingPromotion.id ? updatedData : p))
          : [...prev, updatedData]
      );

      toast.success(`Promotion ${editingPromotion ? "updated" : "added"} successfully!`);
      setShowModal(false);
      setNewPromotion({
        id: "",
        discountCode: "",
        discountPercentage: "",
        validFrom: "",
        validTo: "",
        isActive: false
      });
      setEditingPromotion(null);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${editingPromotion ? "update" : "add"} promotion`);
    }
  };

  // Delete a promotion
  const removePromotion = async (id) => {
    try {
      const response = await fetch(`${API_URL}/discount/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete promotion");

      setPromotions((prev) => prev.filter((promo) => promo.id !== id));
      toast.success("Promotion deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete promotion");
    }
  };

  // Open edit modal
  const editPromotion = (promo) => {
    const formattedPromotion = {
      ...promo,
      validFrom: promo.validFrom ? new Date(promo.validFrom).toISOString().split("T")[0] : "",
      validTo: promo.validTo ? new Date(promo.validTo).toISOString().split("T")[0] : "",
    };
    setNewPromotion(formattedPromotion);
    setEditingPromotion(formattedPromotion);
    setShowModal(true);
  };

  return (
    <Row className="mx-2">
      <div className="text-start pt-2 mb-3">
        <h2 className="mb-3">Promotions & Discounts Management</h2>
        <Button variant="danger" className="mb-3" onClick={() => setShowModal(true)}>
          <Plus size={16} className="me-2" /> Add New Promotion
        </Button>
      </div>
      {promotions.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Discount Code</th>
              <th>Discount Percentage</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo, index) => (
              <tr key={promo.id}>
                <td>{index + 1}</td>
                <td>{promo.discountCode}</td>
                <td>{promo.discountPercentage}%</td>
                <td>{new Date(promo.validFrom).toLocaleDateString()}</td>
                <td>{new Date(promo.validTo).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${promo.isActive ? "bg-success" : "bg-secondary"}`}
                  >
                    {promo.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <Button className="edited py-2" onClick={() => editPromotion(promo)}>
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="danger"
                    className="py-2 px-3"
                    onClick={() => {
                      removePromotion(promo.id);
                      setEditingPromotion(null);
                      setNewPromotion({ id: "", discountCode: "", discountPercentage: "", validFrom: "", validTo: "", isActive: false });
                    }}
                                      >
                    <Trash size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for Add/Edit Promotion */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setNewPromotion({ id: "", discountCode: "", discountPercentage: "", validFrom: "", validTo: "", isActive: false });
        setEditingPromotion(null);
        }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingPromotion ? "Edit Promotion" : "Add New Promotion"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Discount Code</Form.Label>
              <Form.Control
                type="text"
                name="discountCode"
                value={newPromotion.discountCode}
                onChange={handleInputChange}
                placeholder="E.g.: DISCOUNT20"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                name="discountPercentage"
                value={newPromotion.discountPercentage}
                onChange={handleInputChange}
                placeholder="E.g.: 20"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valid From</Form.Label>
              <Form.Control
                type="date"
                name="validFrom"
                value={newPromotion.validFrom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valid To</Form.Label>
              <Form.Control
                type="date"
                name="validTo"
                value={newPromotion.validTo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={newPromotion.isActive}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={addOrUpdatePromotion}
            disabled={
              editingPromotion &&
              JSON.stringify(newPromotion) === JSON.stringify(editingPromotion)
            }
          >
            {editingPromotion ? "Update Promotion" : "Save Promotion"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
