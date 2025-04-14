import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import './CardComponent.css';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const CardComponent = ({ currentPage, itemsPerPage, onTotalBlogs }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = `${process.env.REACT_APP_URL}/api/v1`;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/blogs`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs. Status: ${response.status}`);
        }
        
        const data = await response.json();
        setBlogs(data);
        onTotalBlogs(data.length);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error.message);
        toast.error("Failed to load blogs!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [onTotalBlogs]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">{t('blog.items.loading')}</span>
        </Spinner>
      </Container>
    );
  }

  if (error && blogs.length === 0) {
    return (
      <Container className="pt-5 pb-3">
        <div className="text-center text-danger">
          <h4>{t('blog.items.noPosts')}</h4>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-5 pb-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <Row>
        {currentBlogs.length === 0 ? (
          <Col className="text-center">
            <p>{t('blog.items.noPosts')}</p>
          </Col>
        ) : (
          currentBlogs.map((blog) => (
            <Col key={blog.id} md={4} className="mb-4">
              <Card className="text-white text-start blog-card h-100">
                <Card.Img src={blog.image} alt={blog.title} />
                <Card.ImgOverlay className="d-flex flex-column justify-content-end bg-dark bg-opacity-25">
                  <div className="p-2">
                    <Card.Text className="fs-6">
                      {blog.category}
                      <i className="fa-solid fa-circle mx-2"></i>
                      <span>{blog.readTime || "3 min read"}</span>
                    </Card.Text>
                    <Card.Title className="fs-6 fw-bold">{blog.title}</Card.Title>
                    <Link 
                      to={`/blog/${blog.id}`} 
                      className="text-white text-decoration-none hover-effect"
                    >
                      {t('blog.items.readMore')} {isRTL ? "←" : "→"}
                    </Link>
                  </div>
                </Card.ImgOverlay>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default CardComponent;