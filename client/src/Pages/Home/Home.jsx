import 'bootstrap/dist/css/bootstrap.min.css'
import './Home.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Container, Row, Col,Card, CardBody, CardTitle, CardText, Button} from 'react-bootstrap'
import { FaMapMarkerAlt, FaUtensils, FaMoneyBillAlt, FaTruck,FaQuoteLeft , FaWhatsapp  } from "react-icons/fa";
import { useState,useEffect,useRef } from 'react'
import { FaHeart,FaRegCheckCircle,FaHamburger } from 'react-icons/fa'
import { GiSandwich, GiNoodles, GiHotMeal } from "react-icons/gi";
/*import images */
import bitz1 from '../../../src/assets/bitz1.png'
import bitz2 from '../../../src/assets/bitz2.png'
import food1 from '../../../src/assets/foods/food1.png'
import food2 from '../../../src/assets/foods/food2.png'
import food3 from '../../../src/assets/foods/food3.png'
import food4 from '../../../src/assets/foods/food4.png'
import food5 from '../../../src/assets/foods/food5.png'
import homeph from '../../../src/assets/home-phone.png'
/*testimonial images */
import jonson from '../../../src/assets/testimonial/1.png'
import david from '../../../src/assets/testimonial/2.png'
import robert from '../../../src/assets/testimonial/3.png'
import Faq from '../../Components/Faq/Faq';

/*== end import images== */
/*components*/
import NavBar from '../../Components/NavBar/NavBar.jsx'
import Footer from '../../Components/Footer/Footer.jsx'
import Find from '../../Components/FindOut/Find.jsx';
/*==end components== */

import { useCartContext } from '../../Contexts/CartContext';
import { useFavoriteContext } from '../../Contexts/FavoriteContext.jsx';

import { useTranslation } from 'react-i18next';
const Home = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCartContext();
  const {addToFavorites}=useFavoriteContext();
  const groupLink = "https://chat.whatsapp.com/I1bHO8ZYsyM8Na2teQs5s4";


  //handel most items popular section
  const [allProducts, setAllProducts] = useState([]);

  // Add this function to fetch all products
  const fetchAllProducts = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_URL}/api/v1/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch all products");
        return response.json();
      })
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
        setLoading(false);
      });
  };

  // Add this useEffect to fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  //handel Some Traditional Food Based on Location section
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all categories on component mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/api/v1/categories`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        // Select the first category by default if available
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
          fetchProductsByCategory(data[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Function to fetch products by category ID
  const fetchProductsByCategory =(categoryId) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_URL}/api/v1/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      
      .then((data) => {
        console.log(data);
        // Filter products based on the selected category
        const filteredProducts =data.filter(
          (product) => product.category === categoryId
        );
        setProducts(filteredProducts);
        console.log("filteredProducts == ",filteredProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    console.log("categoryId == ",categoryId);
    setSelectedCategory(categoryId);
    fetchProductsByCategory(categoryId);
  };

  /*=====Food Data===== */
  const categoriess = [
    { icon: <FaHamburger />, title: "Delish Burger", items: "25 items" },
    { icon: <GiSandwich />, title: "Sandwiches", items: "25 items" },
    { icon: <GiHotMeal />, title: "Mexican Cuisine", items: "25 items" },
    { icon: <GiNoodles />, title: "Italian Cuisine", items: "25 items" },
  ];

  return (
    <>
      <NavBar />
      <div className="home" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className={`container content ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
          <h1 className={`text-white mb-3 fw-bold ${i18n.language === 'ar' ? 'w-100' : 'w-75'} home-title`}>
            {t('home.title')}
          </h1>
          <h2 className="text-danger mb-3 text-col">{t('home.subtitle')}</h2>
          <p className="text-white">
            {t('home.description')}
          </p>
          <div className="bg-white p-2 mt-4 rounded text-center">
            <button className={`btn btn-first ${i18n.language === 'ar' ? 'ms-2' : 'me-2'} px-5 py-3`}>
              {t('home.delivery')}
            </button>
            <button className={`btn btn-other ${i18n.language === 'ar' ? 'ms-2' : 'me-2'} border-danger px-5 py-3`}>
              {t('home.pickup')}
            </button>
            <button className="res-btn btn btn-other border-danger px-5 py-3">
              {t('home.inRestaurant')}
            </button>
          </div>
        </div>
      </div>
      {/* Quategory Section */}

      <Container className="py-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Title */}
        <Row className="mb-4">
          <Col>
            <h2 className={`fw-bold ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t('home.categories.title')}
            </h2>
          </Col>
          <Col className={i18n.language === 'ar' ? 'text-start' : 'text-end'}>
            <Button variant="outline-dark" className="rounded-pill">
              {t('home.categories.seeMore')}
            </Button>
          </Col>
        </Row>

        {/* Categories */}
        <Row className="g-3">
          {categoriess.map((category, index) => (
            <Col key={index} lg={3} md={4} xs={12}>
              <Card className="category-card shadow-sm">
                <Card.Body className={`d-flex align-items-center gap-2 px-2 py-2 py-md-3 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {/* Icon Next to Text */}
                  <div className={`category-icon ${i18n.language === 'ar' ? 'ms-3' : 'me-3'}`}>
                    {category.icon}
                  </div>
                  <div className={`text-container ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <Card.Title className="mb-1 title-text text-nowrap">
                      {t(`home.categories.${category.title.toLowerCase().replace(/\s+/g, '')}`)}
                    </Card.Title>
                    <Card.Text className="text-muted fs-6">
                      <span className="dot"></span> {category.items}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <div className="container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="special-offers-container">
          <img
            src={bitz1}
            alt="Special Burger Offer"
            className="offer-image img-1"
          />
          <img
            src={bitz2}
            alt="Chicken Burger Offer"
            className="offer-image img-2"
          />
        </div>
      </div>

      <div className="container my-4 text-start" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-center fw-bold mb-5">
          {t('home.traditionalFood.title')}
        </h2>

        {/* Category tabs */}
        <div className="button-container d-flex justify-content-center mb-3 bg-light p-2 rounded mb-5">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn btn-c mx-1 fw-bold fs-5 ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Display products */}
        <div className="row text-start">
          {loading ? (
            <div className="text-center w-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('home.traditionalFood.loading')}</span>
              </div>
            </div>
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card">
                  <div className="love-icon" onClick={()=>addToFavorites(product)}>
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <img
                    src={product.images[0]}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5>{product.name}</h5>
                    <div className="d-flex">
                      <p className="me-5">{t('home.traditionalFood.price')}: ${product.price}</p>
                      <p>
                        {t('home.traditionalFood.rating')} {product.rating || 4.5} (
                        {product.reviewCount || "2.5K"})
                      </p>
                    </div>
                    <button className="btn btn-add" onClick={()=>addToCart(product)}>
                      <i className="fa-solid fa-cart-shopping me-4"></i>
                      {t('home.traditionalFood.addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-100">
              <p>{t('home.traditionalFood.noProducts')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dining Experience Section */}
      <div className="dinning" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container text-white pt-5 pb-5">
          <div className={`row ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className="col-md-6 mb-sm-5">
              <img src={homeph} alt="Dining Experience" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h2 className={`text-start head-text fw-bold mb-4 mb-sm-5 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('home.diningExperience.title')}
              </h2>
              <div className="content-process">
                <div className={`step mb-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <FaMapMarkerAlt className={`step-icon ${i18n.language === 'ar' ? 'ms-4' : 'me-4'}`} />
                  <div className={`text-start step-text ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <h4>{t('home.diningExperience.location.title')}</h4>
                    <p className="step-text-p">
                      {t('home.diningExperience.location.description')}
                    </p>
                  </div>
                </div>
                <div className={`step mb-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <FaUtensils className={`step-icon ${i18n.language === 'ar' ? 'ms-4' : 'me-4'}`} />
                  <div className={`text-start step-text ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <h4>{t('home.diningExperience.selectFood.title')}</h4>
                    <p className="step-text-p">
                      {t('home.diningExperience.selectFood.description')}
                    </p>
                  </div>
                </div>
                <div className={`step mb-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <FaMoneyBillAlt className={`step-icon ${i18n.language === 'ar' ? 'ms-4' : 'me-4'}`} />
                  <div className={`text-start step-text ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <h4>{t('home.diningExperience.payment.title')}</h4>
                    <p className="step-text-p">
                      {t('home.diningExperience.payment.description')}
                    </p>
                  </div>
                </div>
                <div className={`step ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <FaTruck className={`step-icon ${i18n.language === 'ar' ? 'ms-4' : 'me-4'}`} />
                  <div className={`text-start step-text ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <h4>{t('home.diningExperience.delivery.title')}</h4>
                    <p className="step-text-p">
                      {t('home.diningExperience.delivery.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Popular Items Section */}
      <div className="container my-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className={`fw-bold mb-5 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t('home.popularItems.title')}
        </h2>
        <div className="row g-4">
          {allProducts
            .filter((product) => product.rating >= 4.5)
            .map((food, index) => (
              <div
                key={index}
                className={`col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 d-flex flex-column flex-sm-row align-items-center popular-item mb-4 ${i18n.language === 'ar' ? 'flex-sm-row-reverse' : ''}`}
              >
                <div className="popular-food-image-container">
                  <img
                    src={
                      food.images && food.images.length > 0
                        ? food.images[0]
                        : food1
                    }
                    className="popular-food-image"
                    alt={food.name}
                  />
                </div>
                <div className={`popular-food-details p-3 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                  <h5>{food.name}</h5>
                  <p>
                    <FaRegCheckCircle className={`text-danger ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`} />
                    {food.ingredients && food.ingredients.length > 0
                      ? food.ingredients[0]
                      : t('home.popularItems.premiumIngredients')}
                  </p>
                  <p>
                    <FaRegCheckCircle className={`text-danger ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`} />
                    {food.ingredients && food.ingredients.length > 1
                      ? food.ingredients[1]
                      : t('home.popularItems.specialSauce')}
                  </p>
                  <h6>${food.price}</h6>
                  <Button 
                    className={`add-to-cart ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`} 
                    onClick={() => addToCart(food)}
                  >
                    <i className={`fa-solid fa-cart-shopping ${i18n.language === 'ar' ? 'ms-4' : 'me-4'}`}></i>
                    {t('home.traditionalFood.addToCart')}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Customer Testimonials Section */}
      <div className="testimonials" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container my-5">
          <h2 className={`text-center pt-5 pb-5 fw-bold text-white fs-1 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
            {t('home.testimonials.title')}
          </h2>
          <div className="row g-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-12 testimonial-card">
                <div className="testimonial-content position-relative p-4">
                  <FaQuoteLeft className={`quote-icon ${i18n.language === 'ar' ? 'end-0' : 'start-0'}`} />
                  <p className={`text-white testimonial-text ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    {t('home.testimonials.testimonialText')}
                  </p>
                </div>
                <div className={`testimonial-user pt-3 pb-5 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={`${
                      index === 0 ? jonson : index === 1 ? david : robert
                    }`}
                    alt="User"
                    className={`user-img ${i18n.language === 'ar' ? 'ms-3' : 'me-3'}`}
                  />
                  <div className={`${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <p>⭐⭐⭐⭐⭐</p>
                    <h5 className="fw-bold text-white">
                      {t(`home.testimonials.users.${index === 0 ? 'jonson' : index === 1 ? 'david' : 'robert'}.name`)}
                    </h5>
                    <p className="text-white">
                      {t(`home.testimonials.users.${index === 0 ? 'jonson' : index === 1 ? 'david' : 'robert'}.role`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Faq />
      <Find />

      <Footer />
      <div>
      <a
       href={groupLink}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
      </div>
    </>
  );
}

export default Home