import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Alert, Image, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BlogDetails.css";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import Navbar from '../../Components/NavBar/NavBar';
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

// Import images
import user1 from '../../assets/BlogDetails/per1.png';
import user2 from '../../assets/BlogDetails/per2.png';
import per1 from '../../assets/BlogDetails/comm1.png';
import per2 from '../../assets/BlogDetails/comm2.png';
import per3 from '../../assets/BlogDetails/comm3.png';
import bur1 from '../../assets/BlogDetails/bur1.png';
import bur2 from '../../assets/BlogDetails/bur2.png';

const API_URL = `${process.env.REACT_APP_URL}/api/v1`;

const BlogDetails = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentMessage, setCommentMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch blog details and comments
  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        // Fetch the specific blog
        const response = await fetch(`${API_URL}/blog/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog. Status: ${response.status}`);
        }
        
        const data = await response.json();
        setBlog(data);
        
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError(error.message);
        toast.error(t('blog.details.error.load'));
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_URL}/comments/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error(t('blog.details.error.comments'));
      }
    };

    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs?limit=4`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch related blogs");
        }
        
        const data = await response.json();
        const filtered = Array.isArray(data) 
          ? data.filter(blog => blog.id !== parseInt(id)).slice(0, 4)
          : [];
        setRelatedBlogs(filtered);
        
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };
    
    fetchBlogDetails();
    fetchComments();
    fetchRelatedBlogs();
  }, [id, t]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentMessage) {
      toast.warning(t('blog.details.commentPlaceholder'));
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/comment/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comment: commentMessage,
          blogId: id,
          reply: []
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('blog.details.error.submit'));
      }
      
      const newComment = await response.json();
      
      // Add the new comment to the comments list
      setComments(prevComments => [newComment, ...prevComments]);
      
      toast.success(t('blog.details.submit'));
      
      // Clear form
      setCommentMessage("");
      
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(error.message || t('blog.details.error.submit'));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Banner pageName={t('blog.details.title')} />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
        <Footer />
      </>
    );
  }

  if (error && !blog) {
    return (
      <>
        <Navbar />
        <Banner pageName={t('blog.details.title')} />
        <Container className="text-center py-5">
          <Alert variant="danger">
            <h4>{t('blog.details.error.load')}</h4>
            <p>{error}</p>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <Banner pageName={t('blog.details.title')} />
        <Container className="text-center py-5">
          <Alert variant="warning">
            <h4>{t('blog.items.noPosts')}</h4>
            <p>{t('blog.details.error.load')}</p>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <Banner pageName={t('blog.details.title')}/>
      <Container className="blog-details" dir={isRTL ? 'rtl' : 'ltr'}>
        <Row className="blog-content pt-5 pb-5">
          <Col lg={8} md={12}>
            <div className={`blog-header py-5 ${isRTL ? 'text-end' : 'text-start'}`}>
              <h1 className="mb-4">{blog.title}</h1>
              <p className="text-secondary">{blog.content}</p>
            </div>
            <div className="headimage mb-4 w-100">
              <Image
                src={blog.image}
                alt={blog.title}
                rounded
                fluid
                className="w-100"
              />
            </div>
            
            <h2 className={`fw-bold mb-2 ${isRTL ? 'text-end' : 'text-start'}`}>{blog.subtitle || "The Art of Fusion :"}</h2>
            <p className={isRTL ? 'text-end' : 'text-start'}>{blog.detailedContent || 
              "Discover the artistry of blending flavors and techniques from different cuisines. Explore how culinary fusion can result in unique and tantalizing dishes that transcend cultural boundaries. From Japanese-Peruvian fusion to modern twists on classic comfort foods, we'll take you on a global taste tour that celebrates the beauty of culinary creativity."
            }</p>
            
            <Alert style={{background:"red"}} className={`aler-text fw-bold p-4 text-white mt-4 mb-4 ${isRTL ? 'text-end' : 'text-start'}`}>
              {blog.quote || "We can easily manage if we will only take, each day, as the burden it. But the load will be too heavy for us if we carry yesterday's burden over again today."}
            </Alert>
            
            <p className={isRTL ? 'text-end' : 'text-start'}>
              {blog.conclusion || "Prepare to be inspired, your taste buds to be tantalized, and your love for food to be reignited. Whether you're seeking new recipes, cultural insights, or a deeper appreciation for the art of cooking, our blog is your passport to a world of culinary delights and gastronomic adventures."}
            </p>
            
            <Row className="mt-4 mb-4">
              <Col md={6} sm={12}>
                <img src={blog.additionalImages?.[0] || user1} className="mb-3 w-100" alt="Food 1" />
              </Col>
              <Col md={6} sm={12}>
                <img src={blog.additionalImages?.[1] || user2} className="mb-3 w-100" alt="Food 2" />
              </Col>
            </Row>
            
            <div className="comments">
              <h3 className={`mb-4 ${isRTL ? 'text-end' : 'text-start'}`}>
                {comments.length} {t('blog.details.comments')}
              </h3>
              
              {comments.length > 0 ? (
                comments.map((comment, index) => {
                  const isLoggedUser = comment.customerDetails?.id === localStorage.getItem('userId');
                  return (
                    <div 
                      key={comment.id} 
                      className={`comment-box d-flex mb-4 rounded ${isLoggedUser ? 'logged-user' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`img-per1 ${isRTL ? 'ms-4' : 'me-4'}`}>
                        <img 
                          src={comment.customerDetails?.profileImage || (index === 0 ? per1 : index === 1 ? per2 : per3)} 
                          alt={`${comment.customerDetails?.firstName || 'User'}`}
                          className="rounded-circle"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className={`text-content w-100 ${isRTL ? 'text-end' : 'text-start'}`}>
                        <div className={`text-date d-flex justify-content-between position-relative ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <strong>{`${comment.customerDetails?.firstName || 'Anonymous'} ${comment.customerDetails?.lastName || ''}`}</strong>
                          <h6 className="text-danger">{new Date(comment.date).toLocaleDateString()}</h6>
                        </div>
                        <p>{comment.comment}</p>
                        {comment.reply && comment.reply.length > 0 && (
                          <div className={`replies mt-2 ${isRTL ? 'me-4' : 'ms-4'}`}>
                            {comment.reply.map((reply, replyIndex) => (
                              <div key={replyIndex} className="reply-box p-2 bg-light rounded">
                                <p className="mb-0">{reply}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={`text-center text-muted ${isRTL ? 'text-end' : 'text-start'}`}>{t('blog.details.noComments')}</p>
              )}
              
              <Form className={`mt-3 mb-5 pb-4 form container rounded ${isRTL ? 'text-end' : 'text-start'}`} onSubmit={handleSubmitComment}>
                <h3 className="pt-4">{t('blog.details.leaveComment')}</h3>
                <p>{t('blog.details.emailNote')}</p>
                <Form.Group className="mb-5">
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    placeholder={t('blog.details.commentPlaceholder')}
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                    required
                    className={isRTL ? 'text-end' : 'text-start'}
                  />
                </Form.Group>
                <Button 
                  variant="danger" 
                  className="mb-5"
                  type="submit"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                      {t('blog.details.submitting')}
                    </>
                  ) : t('blog.details.submit')}
                </Button>
              </Form>
            </div>
          </Col>
          
          <Col lg={4} md={12}>
            <div className={`sidebar container rounded pb-2 ${isRTL ? 'text-end' : 'text-start'}`}>
              <h4 className="mt-4 mb-4 pt-3">{t('blog.details.latestBlog')}</h4>

              {relatedBlogs.length > 0 ? (
                relatedBlogs.map((blog) => (
                  <div key={blog.id} className={`blog1 d-flex mb-4`}>
                    <div style={{maxWidth: "100px",maxHeight: "90px"}} className={`blog-imag ${isRTL ? 'ms-4' : 'me-4'}`}>
                      <img className="w-100 h-100 object-fit-cover rounded" src={blog.image} alt="" />
                    </div>
                    <div className="content">
                      <h4 className="fs-5">{blog.title}</h4>
                      <p className={`d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <MdDateRange className={`text-danger ${isRTL ? 'ms-2' : 'me-2'}`}/>
                        {blog.readTime || "3 min read"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">{t('blog.items.noPosts')}</p>
              )}
            </div>
            <div className={`follow-us mt-5 mb-5 p-4 container rounded ${isRTL ? 'text-end' : 'text-start'}`}>
              <h4>{t('blog.details.followUs')}</h4>
              <div className={`icons text-danger fs-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AiFillTwitterCircle className={isRTL ? 'ms-4' : 'me-4'} />
                <FaLinkedin className={isRTL ? 'ms-4' : 'me-4'} />
                <FaFacebook className={isRTL ? 'ms-4' : 'me-4'} />
                <FaYoutube />
              </div>
            </div>

            <div className="burger-imgs">
              <div className="w-100 h-100 overflow-hidden">
                <img className="mb-4 w-100 h-100" src={bur1} alt="" />
              </div>
              <div className="w-100 h-100 overflow-hidden">
                <img className="w-100 h-100" src={bur2} alt="" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Faq />
      <Find />
      <Footer />
    </>
  );
};

export default BlogDetails;