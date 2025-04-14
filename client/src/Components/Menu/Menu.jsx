import React, { useRef, useEffect} from "react";
import { Card, Button, Row, Col, Badge, Container, Spinner} from "react-bootstrap";
import { Link} from "react-router-dom";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import "./Menu.css";
import { useCartContext } from "../../Contexts/CartContext";
import { useFavoriteContext } from "../../Contexts/FavoriteContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const Foodcard = ({ products, loading }) => {
  const { addToCart } = useCartContext();
  const { addToFavorites } = useFavoriteContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observers = [];

    cardRefs.current.forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                el,
                { y: "100" ,opacity:1},
                {
                  y: "0",
                  scrollTrigger: {
                    trigger: el,
                    opacity:0,
                    start: "top 95%",
                    toggleActions: "play none none none",
                    duration: 1,
                  },
                }
              );
            }
          });
        },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h3 className="mt-3 text-muted">{t('menu.items.loading')}</h3>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-muted">{t('menu.items.noProducts')}</h3>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="g-4 mb-5">
        {products.map((item) => (
          <Col key={item.id} md={4} ref={addToRefs}>
            <Card className="position-relative shadow-lg photomenu">
              <div className="favorite-container" onClick={() => addToFavorites(item)}>
                <FaHeart className="text-danger fs-2 favorite-icon" />
              </div>
              <div className="overflow-hidden">
                <Card.Img variant="top" src={item.images?.[0]||item.image} className="imgmenu" />
                <Badge bg="dark" className={`position-absolute top-0 end-0 m-2`}>
                  {item.discount ||0}{t('menu.items.off')}
                </Badge>
              </div>
              <Card.Body>
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <div>
                    <h5 className="text-danger fw-bold">${item.price}</h5>
                  </div>
                  <div>
                    <FaStar className="text-warning me-1" />
                    <span className="fw-bold">{item.rating ??0}</span>
                    <span className="text-muted ms-1">({item.reviews?.length ??0})</span>
                  </div>
                </div>
                <Link to={`/item/${item.id}`}>
                  <Card.Title className={`text-${isRTL ? 'end' : 'start'} my-3 text-primary`}>{item.name}</Card.Title>
                </Link>
                <ul className={`list-unstyled mb-3 text-${isRTL ? 'end' : 'start'}`}>
                  <li className="mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 12L10.5347 14.2812C10.9662 14.6696 11.6366 14.6101 11.993 14.1519L16 9M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#FE724C"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>{" "}
                    {item.meal_contents?.[0]?.quantity ?? 0} {item.meal_contents?.[0]?.item ?? ""}
                  </li>
                  <li dir={isRTL ? 'rtl' : 'ltr'}>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 12L10.5347 14.2812C10.9662 14.6696 11.6366 14.6101 11.993 14.1519L16 9M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#FE724C"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>{" "}
                    {item.meal_contents?.[1]?.item ?? ""}
                  </li>
                </ul>
                <Button className="add-btn w-100" onClick={() => addToCart(item)}>
                  <FaShoppingCart className={isRTL ? "ms-2" : "me-2"} /> {t('menu.items.addToCart')}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Foodcard;
