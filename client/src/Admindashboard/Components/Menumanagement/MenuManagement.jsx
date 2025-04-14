import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Row } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Menumanagement.css";
const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    rating: 4.5,
    size: "Small",
    discount: "",
    ingredients: [],
    meal_contents: [],
    addon: "",
    images: [],
    category: "",
    quantity: 0,
    videoUrl: "",
    imageFiles: [],
  });

  

  // API base URL - replace with your actual backend URL
  const API_BASE_URL = `${process.env.REACT_APP_URL}/api/v1`;
  // Function to get category name from category ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  // Fetch menu items from the backend API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched menu items:", data);
      
      // Extract the items array from the response
      const items = data.data || data.products || data;
      setMenuItems(Array.isArray(items) ? items : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);


  // Fetch categories from the backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/categories`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        console.log("Fetched Categories:", data);

        // Assuming the API returns either the categories directly or has a data property
        const categoriesList = data.data || data.categories || data;
        setCategories(Array.isArray(categoriesList) ? categoriesList : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please refresh the page.");
      }
    };

    fetchCategories();
  }, []);

  const handleClose = () => {
    setShow(false);
    setEditItem(null);
    setNewItem({
      name: "",
      price: "",
      rating: 4.5,
      size: "Small",
      discount: "",
      ingredients: [],
      meal_contents: [],
      addon: "",
      images: [],
      category: "",
      quantity: 0,
      videoUrl: "",
      imageFiles: [],
    });
    // Clear any error or success messages when closing the modal
    setError(null);
    setSuccessMessage(null);
  };

  const handleShow = () => setShow(true);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      // Update the images array with the preview URL
      const updatedImages = [...newItem.images];
      updatedImages[index] = previewUrl;
      
      // Update the imageFiles array with the actual file
      const updatedFiles = [...newItem.imageFiles];
      updatedFiles[index] = file;

      setNewItem({
        ...newItem,
        images: updatedImages,
        imageFiles: updatedFiles
      });
    }
  };

  const handleAddImage = () => {
    setNewItem({
      ...newItem,
      images: [...(newItem.images || []), ""],
      imageFiles: [...(newItem.imageFiles || []), null]
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = newItem.images.filter((_, i) => i !== index);
    const updatedFiles = newItem.imageFiles.filter((_, i) => i !== index);
    
    setNewItem({
      ...newItem,
      images: updatedImages,
      imageFiles: updatedFiles
    });
  };

  const addItem = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      
      // Add all the text fields
      formData.append("name", newItem.name);
      formData.append("price", parseFloat(newItem.price) || 0);
      formData.append("rating", parseFloat(newItem.rating) || 4.5);
      formData.append("size", newItem.size || "Small");
      formData.append("addon", newItem.addon || "");
      formData.append("quantity", parseInt(newItem.quantity, 10) || 0);
      formData.append("discount", parseFloat(newItem.discount) || 0);
      formData.append("category", newItem.category);
      formData.append("ingredients", JSON.stringify(newItem.ingredients?.filter(ing => ing.trim() !== "") || []));
      formData.append("meal_contents", JSON.stringify(newItem.meal_contents?.filter(mc => mc.item.trim() !== "") || []));
      formData.append("videoUrl", newItem.videoUrl || "");

      // Add image files
      newItem.imageFiles.forEach((file, index) => {
        if (file) {
          formData.append(`images`, file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/product/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const data = await response.json();
      console.log("Item added successfully:", data);
      
      // Refresh the menu items list
      await fetchMenuItems();
      
      // Show success message
      setSuccessMessage("Item added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Close the modal and reset the form
      handleClose();
    } catch (error) {
      console.error("Error adding item:", error);
      setError(error.message || "Failed to add item");
    }
  };

  const updateItem = async () => {
    const token = localStorage.getItem("token");
    if (!editItem) return;
  
    try {
      // Make sure we have the ID
      const itemId = editItem._id || editItem.id;

      if (!itemId) {
        console.error("Unable to update: Item ID is missing");
        setError("Unable to update: Item ID is missing");
        return;
      }

      // Check for token
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      // Prepare the item data for update
      const itemToUpdate = {
        name: newItem.name,
        price: parseFloat(newItem.price) || 0,
        rating: parseFloat(newItem.rating) || 4.5,
        size: newItem.size || "Small",
        addon: newItem.addon || "",
        quantity: parseInt(newItem.quantity, 10) || 0,
        discount: parseFloat(newItem.discount) || 0,
        category: newItem.category, // This should be the ID
        images: newItem.images?.length ? newItem.images.filter(img => img.trim() !== "") : ["https://reservq.vercel.app/assets/traditional-3-248258a0.png"],
        ingredients: newItem.ingredients?.filter(ing => ing.trim() !== "") || [],
        meal_contents: newItem.meal_contents?.filter(mc => mc.item.trim() !== "") || [],
        videoUrl: newItem.videoUrl || ""
      };

      console.log("Updating item with ID:", itemId);
      console.log("Update payload:", itemToUpdate);

      // Make the API call to update the item
      const response = await fetch(`${API_BASE_URL}/product/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(itemToUpdate),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message ||
            errorData.error ||
            `Failed with status: ${response.status}`;
        } catch (e) {
          errorMessage = `Request failed with status: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Parse the successful response
      const updatedItem = await response.json();
      console.log("Update successful:", updatedItem);

      // Refresh the menu items list after successful update
      await fetchMenuItems();
      
      // Show success notification
      setSuccessMessage("Item updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Close the modal
      handleClose();
    } catch (err) {
      console.error("Error updating menu item:", err);
      setError(err.message || "Failed to update menu item");
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      
      // Show confirmation dialog
      if (!window.confirm("Are you sure you want to delete this item?")) {
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || `Failed with status: ${response.status}`;
        } catch (e) {
          errorMessage = `Request failed with status: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Show success message
      setSuccessMessage("Item deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh the menu items list
      await fetchMenuItems();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError(err.message || "Failed to delete item");
      setTimeout(() => setError(null), 5000);
    }
  };

  const editMenuItem = (item) => {
    setEditItem(item);
    // Find the category object to get both ID and name
    const categoryObj = categories.find(cat => cat._id === item.category || cat.id === item.category);
  
    // Ensure all expected properties exist, even if empty
    setNewItem({
      name: item.name || "",
      price: item.price || 0,
      rating: item.rating || 4.5,
      size: item.size || "Small",
      discount: item.discount || 0,
      ingredients: item.ingredients || [],
      meal_contents: item.meal_contents || [],
      addon: item.addon || "",
      images: item.images || [],
      category: item.category || "", // This is the ID
      categoryName: categoryObj ? categoryObj.name : "", // This is the name for display
      quantity: item.quantity || 0,
      videoUrl: item.videoUrl || "",
    });
    handleShow();
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...(newItem.ingredients || [])];
    updatedIngredients[index] = value;
    setNewItem({ ...newItem, ingredients: updatedIngredients });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...(newItem.images || [])];
    updatedImages[index] = value;
    setNewItem({ ...newItem, images: updatedImages });
  };

  const handleMealContentChange = (index, field, value) => {
    const updatedMealContents = [...(newItem.meal_contents || [])];
    updatedMealContents[index] = { 
      ...updatedMealContents[index], 
      [field]: field === 'quantity' ? (parseInt(value, 10) || 1) : value 
    };
    setNewItem({ ...newItem, meal_contents: updatedMealContents });
  };

  return (
    <Row className="mx-2 pb-4">
  <div className="text-start">
    <h2 className="my-4">Menu Management</h2>
    <Button className="btn btn-danger py-2" onClick={handleShow}>
      <FaPlus /> Add Item
    </Button>
  </div>

  {successMessage && (
    <div className="alert alert-success" role="alert">
      {successMessage}
    </div>
  )}

  {error && (
    <div className="alert alert-danger" role="alert">
      Error: {error}
    </div>
  )}

  <Table striped bordered hover className="mt-3" responsive>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Rating</th>
        <th>Size</th>
        <th>Discount</th>
        <th>Ingredients</th>
        <th>Meal Contents</th>
        <th>Add-ons</th>
        <th>Images</th>
        <th>Quantity</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan="13" className="text-center">
            Loading menu items...
          </td>
        </tr>
      ) : menuItems.length === 0 ? (
        <tr>
          <td colSpan="13" className="text-center">
            No menu items found
          </td>
        </tr>
      ) : (
        menuItems.map((item, index) => (
          <tr key={item._id || item.id || index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.categoryName || getCategoryName(item.category)}</td>
            <td>${item.price}</td>
            <td>{item.rating || "N/A"}</td>
            <td>{item.size || "N/A"}</td>
            <td>{item.discount ? `${item.discount}%` : "No Discount"}</td>
            <td>{item.ingredients?.join(", ") || "N/A"}</td>
            <td>
              {item.meal_contents?.length > 0
                ? item.meal_contents.map((content, i) => (
                    <div key={i}>
                      {content.item} ({content.quantity})
                    </div>
                  ))
                : "N/A"}
            </td>
            <td>{item.addon || "N/A"}</td>
            <td>
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                "No Image"
              )}
            </td>
            <td>{item.quantity ?? "N/A"}</td>
            <td>
              <Button
                className="me-2 edititem px-3 py-2"
                onClick={() => editMenuItem(item)}
              >
                <FaEdit className="faedit fs-5" />
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteItem(item._id || item.id)}
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </Table>

  <Modal show={show} onHide={handleClose} scrollable size="lg">
    <Modal.Header closeButton>
      <Modal.Title className="fs-3 fw-bold">
        {editItem ? "Edit Menu Item" : "Add Menu Item"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
            required
          />
        </Form.Group>

        {/* Category */}
        <Form.Group className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Select
            value={newItem.category || ""}
            onChange={(e) => {
              // Find the selected category object
              const selectedCategory = categories.find(
                (cat) =>
                  cat._id === e.target.value || cat.id === e.target.value
              );
              // Store both the ID and name in your state
              setNewItem({
                ...newItem,
                category: e.target.value, // This stores the ID
                categoryName: selectedCategory ? selectedCategory.name : "", // This stores the name for display
              });
            }}
            required
          >
            {categories.length === 0 ? (
              <option disabled>Loading categories...</option>
            ) : (
              <>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </>
            )}
          </Form.Select>
        </Form.Group>

        <div className="row">
          <div className="col-md-6">
            {/* Price */}
            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            {/* Rating */}
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={newItem.rating || 4.5}
                onChange={(e) =>
                  setNewItem({ ...newItem, rating: e.target.value })
                }
              />
            </Form.Group>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            {/* Size */}
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Select
                value={newItem.size || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, size: e.target.value })
                }
              >
                <option value="">Select Size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-4">
            {/* Discount */}
            <Form.Group className="mb-3">
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={newItem.discount || ""}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    discount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            {/* Quantity */}
            <Form.Group className="mb-3">
              <Form.Label>Quantity *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={newItem.quantity || 0}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value, 10) || 0,
                  })
                }
                required
              />
            </Form.Group>
          </div>
        </div>

        {/* Add-ons */}
        <Form.Group className="mb-3">
          <Form.Label>Add-ons</Form.Label>
          <Form.Control
            type="text"
            value={newItem.addon || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, addon: e.target.value })
            }
            placeholder="e.g., Soft Drinks, Extra Cheese"
          />
        </Form.Group>

        {/* Video URL */}
        <Form.Group className="mb-3">
          <Form.Label>Video URL</Form.Label>
          <Form.Control
            type="text"
            value={newItem.videoUrl || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, videoUrl: e.target.value })
            }
            placeholder="e.g., https://www.youtube.com/embed/tJlzIJaokVY"
          />
        </Form.Group>

        {/* Ingredients */}
        <Form.Group className="mb-3">
          <Form.Label>Ingredients</Form.Label>
          {(newItem.ingredients || []).map((ingredient, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <Form.Control
                type="text"
                value={ingredient}
                onChange={(e) =>
                  handleIngredientChange(index, e.target.value)
                }
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  setNewItem({
                    ...newItem,
                    ingredients: newItem.ingredients.filter(
                      (_, i) => i !== index
                    ),
                  })
                }
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            className="ms-1"
            onClick={() =>
              setNewItem({
                ...newItem,
                ingredients: [...(newItem.ingredients || []), ""],
              })
            }
          >
            + Add Ingredient
          </Button>
        </Form.Group>

        {/* Meal Contents */}
        <Form.Group className="mb-3">
          <Form.Label>Meal Contents</Form.Label>
          {(newItem.meal_contents || []).map((content, index) => (
            <div key={index} className="d-flex gap-2 mb-2">
              <Form.Control
                type="text"
                placeholder="Item"
                value={content.item || ""}
                onChange={(e) => handleMealContentChange(index, "item", e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Qty"
                min="1"
                value={content.quantity || 1}
                onChange={(e) => handleMealContentChange(index, "quantity", e.target.value)}
                style={{ maxWidth: "100px" }}
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  setNewItem({
                    ...newItem,
                    meal_contents: newItem.meal_contents.filter(
                      (_, i) => i !== index
                    ),
                  })
                }
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            className="ms-1"
            onClick={() =>
              setNewItem({
                ...newItem,
                meal_contents: [
                  ...(newItem.meal_contents || []),
                  { item: "", quantity: 1 },
                ],
              })
            }
          >
            + Add Meal Content
          </Button>
        </Form.Group>

        {/* Images */}
        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          {(newItem.images || []).map((image, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
              />
              {image && (
                <img 
                  src={image} 
                  alt="Preview" 
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    objectFit: "cover" 
                  }} 
                />
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            className="ms-1"
            onClick={handleAddImage}
          >
            + Add Image
          </Button>
          <Form.Text className="text-muted">
            Upload images for your product. Supported formats: JPG, PNG, GIF
          </Form.Text>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="secondary"
        className="py-2 px-3"
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        className="py-2 px-3"
        onClick={() => (editItem ? updateItem() : addItem())}
      >
        {editItem ? "Update Item" : "Save Item"}
      </Button>
    </Modal.Footer>
  </Modal>
</Row>
  );
};

export default MenuManagement;
