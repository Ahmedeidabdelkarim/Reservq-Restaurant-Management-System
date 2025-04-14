import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Spinner, Row, Badge } from "react-bootstrap";
import "./Categories.css";

const API_URL = `${process.env.REACT_APP_URL}/api/v1/categories`;

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    isActive: true
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      // Assuming the API returns an object with a data property containing the categories array
      const categoriesData = data.data || data;
      
      setCategories(categoriesData);
      setError(null);
    } catch (error) {
      setError("Error fetching categories: " + error.message);
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Handle form input changes for new category
  const handleNewCategoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name === 'name') {
      setNewCategory({
        ...newCategory,
        [name]: value,
        slug: generateSlug(value)
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: val
      });
    }
  };
  
  // Handle form input changes for editing category
  const handleEditCategoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name === 'name') {
      setEditingCategory({
        ...editingCategory,
        [name]: value,
        slug: generateSlug(value)
      });
    } else {
      setEditingCategory({
        ...editingCategory,
        [name]: val
      });
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/category/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
         },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh categories after adding
      await fetchCategories();
      setNewCategory({
        name: "",
        slug: "",
        isActive: true
      });
      setShowAddCategoryModal(false);
    } catch (error) {
      setError("Error adding category: " + error.message);
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with selected category
  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowEditCategoryModal(true);
  };

  // Save edited category
  const handleSaveEditedCategory = async () => {
    if (!editingCategory.name.trim()) {
      setShowEditCategoryModal(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/category/${editingCategory.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(editingCategory),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh categories after editing
      await fetchCategories();
      setShowEditCategoryModal(false);
    } catch (error) {
      setError("Error updating category: " + error.message);
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/category/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh categories after deleting
      await fetchCategories();
    } catch (error) {
      setError("Error deleting category: " + error.message);
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mx-3">
        <div className="categories">
          <div className="text-start">
            <h2 className="categories-title">Categories Management</h2>
            <Button className="mb-3" variant="danger" onClick={() => setShowAddCategoryModal(true)}>
              Add Category
            </Button>
          </div>
          
          {loading && !categories.length ? (
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
            <Table striped bordered hover responsive className="category-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>
                      {category.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td>{formatDate(category.createdAt)}</td>
                    <td>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        className="me-2" 
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="py-1 px-2"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Modal for Adding Category */}
          <Modal
            show={showAddCategoryModal}
            onHide={() => setShowAddCategoryModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    placeholder="Enter category name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={newCategory.slug}
                    onChange={handleNewCategoryChange}
                    placeholder="Enter category slug"
                  />
                  <Form.Text className="text-muted">
                    This will be auto-generated from the name, but you can customize it.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    label="Active"
                    checked={newCategory.isActive}
                    onChange={handleNewCategoryChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim() || loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Saving...</span>
                  </>
                ) : (
                  "Save Category"
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal for Editing Category */}
          <Modal 
            show={showEditCategoryModal} 
            onHide={() => setShowEditCategoryModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editingCategory && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editingCategory.name}
                      onChange={handleEditCategoryChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Slug</Form.Label>
                    <Form.Control
                      type="text"
                      name="slug"
                      value={editingCategory.slug}
                      onChange={handleEditCategoryChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="isActive"
                      label="Active"
                      checked={editingCategory.isActive}
                      onChange={handleEditCategoryChange}
                    />
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={() => setShowEditCategoryModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="success" 
                onClick={handleSaveEditedCategory}
                disabled={!editingCategory?.name?.trim() || loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Row>
    </Container>
  );
};

export default CategoryTable;