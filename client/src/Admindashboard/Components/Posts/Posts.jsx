import { useState, useEffect } from "react";
import { Card, Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import { Trash, Plus, Edit } from "lucide-react";
import { toast } from "react-toastify";
import "./Posts.css";

const API_URL = `${process.env.REACT_APP_URL}/api/v1`;

const PostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    image: null,
    readTime: "",
    category: "",
  });
  const [editingPost, setEditingPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        toast.error("Error loading blogs");
      }
    };
    fetchPosts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the File object in state
      setNewPost((prev) => ({ ...prev, image: file }));
  
    }
  };
  const addOrUpdatePost = async () => {
    if (!editingPost) {
      if (!newPost.title || !newPost.excerpt || !newPost.content || !newPost.readTime || !newPost.category) {
        toast.error("Please fill in all required fields.");
        return;
      }
    }
    try {
      const formData = new FormData();
  
      // Append only filled fields for PATCH (editing)
      if (editingPost) {
        Object.entries(newPost).forEach(([key, value]) => {
          if (value) formData.append(key, value); // Only add non-empty fields
        });
      } else {
        
        // Append all fields for POST (adding)
        Object.entries(newPost).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
  
      const method = editingPost ? "PATCH" : "POST";
      const url = editingPost ? `${API_URL}/blog/${editingPost.id}` : `${API_URL}/blog/add`;
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // Use FormData
      });
  
      if (!response.ok) throw new Error(`Failed to ${editingPost ? "update" : "add"} post`);
  
      const postData = await response.json();
      setPosts((prev) =>
        editingPost ? prev.map((p) => (p.id === editingPost.id ? postData : p)) : [...prev, postData]
      );
  
      toast.success(`Post ${editingPost ? "updated" : "added"} successfully!`);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${editingPost ? "update" : "add"} post`);
    }
  };
    // Delete a post
  const removePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting post.");
    }
  };

  // Edit a post
  const editPost = (post) => {
    setNewPost(post);
    setEditingPost(post);
    setShowModal(true);
  };

  // Close modal and reset fields
  const handleCloseModal = () => {
    setShowModal(false);
    setNewPost({ id: "", title: "", excerpt: "", content: "", image: "", readTime: "", category: "" });
    setEditingPost(null);
  };

  return (
    <Container>
      <div className="text-start">
        <h1 className="my-4 text-start fs-2 fw-bold">Manage Blogs</h1>
        <Button onClick={() => setShowModal(true)} className="mb-3" variant="danger">
          <Plus size={16} /> Add blog
        </Button>
      </div>

      <Row>
        <div className="posts-container">
          {posts.map((post) => (
            <Col xs={12} key={post.id} className="mb-3">
              <Card className="post-card">
                {post.image && <Card.Img variant="top" src={post.image} alt="Post Image" className="post-image" />}
                <Card.Body className="post-content">
                  <Card.Title>{post.title}</Card.Title>
                  <p className="category"><strong>Category:</strong> {post.category}</p> 
                  <p className="read-time"><strong>Read Time:</strong> {post.readTime} minutes</p> 
                  <Card.Text className="excerpt">{post.excerpt}</Card.Text>
                  <p className="excerpt">{post.content}</p> 
                  <div className="d-flex justify-content-end">
                    <Button variant="warning" className="me-2" onClick={() => editPost(post)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="danger" onClick={() => removePost(post.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      </Row>

      {/* Modal for Adding/Editing Posts */}
      <Modal scrollable show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPost ? "Edit Post" : "Add New Post"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={newPost.title} onChange={handleInputChange} placeholder="Enter title" />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control type="text" name="excerpt" value={newPost.excerpt} onChange={handleInputChange} placeholder="Enter excerpt" />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" name="content" value={newPost.content} onChange={handleInputChange} placeholder="Enter content" />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Read Time (minutes)</Form.Label>
              <Form.Control type="number" name="readTime" value={newPost.readTime} onChange={handleInputChange} placeholder="Enter estimated read time" />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={newPost.category} onChange={handleInputChange} placeholder="Enter category" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="danger" onClick={addOrUpdatePost}>{editingPost ? "Update Post" : "Add Post"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PostsManagement;
