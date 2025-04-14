import React, { useState,useEffect } from 'react';
import { Navbar, Container, Nav, Form, Button, Offcanvas} from 'react-bootstrap';
import ReserqLogo from '../../assets/Reserq-logo.svg';
import ReserqLogoBlack from '../../assets/Reserq-logo-black.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { MdFavoriteBorder } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import './NavBar.css';
import { Link ,NavLink, useNavigate } from 'react-router-dom';
import { useCartContext } from '../../Contexts/CartContext';
import { useFavoriteContext } from '../../Contexts/FavoriteContext';
import SearchBar from '../SearchBar/SearchBar';
import { useTranslation } from'react-i18next';
function NavBar() {
    const navigate = useNavigate();
    const { cartNum } = useCartContext();
    const {favoriteNum}=useFavoriteContext();
    const [isTranparent, setIsTranparent] = useState(true);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    // Set default language if not set
    useEffect(() => {
        if (!i18n.language) {
            i18n.changeLanguage('en');
        }
    }, [i18n]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        document.documentElement.lang = newLang;
    };

    useEffect(() => {
        // Set initial language and direction
        const currentLang = i18n.language || 'en';
        document.documentElement.lang = currentLang;
    }, [i18n.language]);

    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsTranparent(true);
            } else {
                setIsTranparent(false);
            }
        };
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1250);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setIsLoggedIn(true);
            setRole(storedRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('data');
        setIsLoggedIn(false);
        setRole(null);
        navigate('/login');
    };


    return (
        <>
            <Navbar
                expand="xl"
                className={`header ${
                    isTranparent ? "hidden" : "solid"
                } d-flex align-items-center`}
            >
                <Container className="d-flex justify-content-between align-items-center">
                    <Link to="/home">
                        <Navbar.Brand href="#home" className='image-container'>
                            <img
                                src={isMobile ? ReserqLogoBlack : ReserqLogo}
                                alt="ReservQ Logo"
                            />
                        </Navbar.Brand>
                    </Link>
                    {isMobile ? (
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center me-4">
                                <Form className="d-flex me-2 position-relative mt-2 search-bar-container">
                                    <SearchBar className="search-bar" />
                                </Form>
                                <button
                                    onClick={toggleLanguage}
                                    className="lang-toggle-btn me-3 bg-transparent border-0"
                                    style={{ color: 'dark' }}
                                >
                                    <MdLanguage size={47}/>
                                </button>
                                <Link to="/cart">
                                    <div className="cart-icon my-2 cursor-pointer me-3 position-relative">
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6.99967 4.66536H20.9997C23.577 4.66536 25.6663 6.7547 25.6663 9.33203V15.1654C25.6663 17.7427 23.577 19.832 20.9997 19.832H11.6663C9.08901 19.832 6.99967 17.7427 6.99967 15.1654V4.66536ZM6.99967 4.66536C6.99967 3.3767 5.95501 2.33203 4.66634 2.33203H2.33301"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M12.833 23.918C12.833 24.8845 12.0495 25.668 11.083 25.668C10.1165 25.668 9.33301 24.8845 9.33301 23.918C9.33301 22.9515 10.1165 22.168 11.083 22.168C12.0495 22.168 12.833 22.9515 12.833 23.918Z"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            ></path>
                                            <path
                                                d="M23.333 23.918C23.333 24.8845 22.5495 25.668 21.583 25.668C20.6165 25.668 19.833 24.8845 19.833 23.918C19.833 22.9515 20.6165 22.168 21.583 22.168C22.5495 22.168 23.333 22.9515 23.333 23.918Z"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            ></path>
                                            <path
                                                d="M16.333 9.33203L16.333 15.1654"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M19.2503 12.25L13.417 12.25"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                        </svg>
                                        <span className="position-absolute translate-middle badge rounded-pill text-count">
                                            {cartNum}
                                        </span>
                                    </div>
                                </Link>
                            </div>

              <Button
                onClick={handleShowOffcanvas}
                className="toggle-btn text-white border-0 py-2"
              >
                <FontAwesomeIcon className="fs-3" icon={faBars} />
              </Button>
            </div>
          ) : (
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto"  dir={isRTL?'rtl':'ltr'}>
                <Nav.Link to="/home" as={NavLink} className="text-white">
                  {t('navbar.home')}
                </Nav.Link>
                <Nav.Link to="/menu" as={NavLink} className="text-white">
                  {t('navbar.menu')}
                </Nav.Link>
                <Nav.Link to="/blog" as={NavLink} className="text-white">
                  {t('navbar.blog')}
                </Nav.Link>
                <Nav.Link to="/about" as={NavLink} className="text-white">
                  {t('navbar.about')}
                </Nav.Link>
                <Nav.Link to="/contact" as={NavLink} className="text-white">
                  {t('navbar.contact')}
                </Nav.Link>
                <Nav.Link to="/reservation" as={NavLink} className="text-white">
                  {t('reservation.title')}
                </Nav.Link>
                {/* <Nav.Link to="/dashboard" as={NavLink} className='text-white'>UserDashboard</Nav.Link> */}
                {role === "admin" && (
                  <Nav.Link to="/admin" as={NavLink} className="text-white">
                    {t('navbar.adminDashboard')}
                  </Nav.Link>
                )}
                {role === "user" && (
                  <Nav.Link to="/dashboard" as={NavLink} className="text-white">
                    {t('navbar.userDashboard')}
                  </Nav.Link>
                )}
              </Nav>

                            {/* Search Form */}
                            <Form className="d-flex me-2 position-relative mt-2 search-bar-container">
                                <SearchBar className="search-bar" />
                            </Form>

                            <Nav>
                                <button
                                    onClick={toggleLanguage}
                                    className="lang-toggle-btn me-3 bg-transparent border-0"
                                    style={{ color: 'white' }}
                                >
                                    <MdLanguage size={47}/>
                                </button>
                                <Link to="/dashboard">
                                    <div className="favorit-icon my-2 cursor-pointer position-relative me-3">
                                        <MdFavoriteBorder className="fs-3" />
                                        <span className="position-absolute translate-middle badge rounded-pill text-count">
                                            {favoriteNum}
                                        </span>
                                    </div>
                                </Link>
                                <Link to="/cart">
                                    <div className="cart-icon my-2 cursor-pointer me-3 position-relative">
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6.99967 4.66536H20.9997C23.577 4.66536 25.6663 6.7547 25.6663 9.33203V15.1654C25.6663 17.7427 23.577 19.832 20.9997 19.832H11.6663C9.08901 19.832 6.99967 17.7427 6.99967 15.1654V4.66536ZM6.99967 4.66536C6.99967 3.3767 5.95501 2.33203 4.66634 2.33203H2.33301"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M12.833 23.918C12.833 24.8845 12.0495 25.668 11.083 25.668C10.1165 25.668 9.33301 24.8845 9.33301 23.918C9.33301 22.9515 10.1165 22.168 11.083 22.168C12.0495 22.168 12.833 22.9515 12.833 23.918Z"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            ></path>
                                            <path
                                                d="M23.333 23.918C23.333 24.8845 22.5495 25.668 21.583 25.668C20.6165 25.668 19.833 24.8845 19.833 23.918C19.833 22.9515 20.6165 22.168 21.583 22.168C22.5495 22.168 23.333 22.9515 23.333 23.918Z"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            ></path>
                                            <path
                                                d="M16.333 9.33203L16.333 15.1654"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M19.2503 12.25L13.417 12.25"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                        </svg>
                                        <span className="position-absolute translate-middle badge rounded-pill text-count">
                                            {cartNum}
                                        </span>
                                    </div>
                                </Link>

                                {isLoggedIn ? (
                                    <>
                                        <button
                                            onClick={handleLogout}
                                            className="logout-btn rounded text-white fs-5 "
                                        >
                                            {t('navbar.logout')}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link to="/login" as={NavLink}>
                                            <Button className="login-button">{t('navbar.login')}</Button>
                                        </Nav.Link>
                                        <Nav.Link to="/signup" as={NavLink}>
                                            <Button className="signup-button">{t('navbar.signup')}</Button>
                                        </Nav.Link>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    )}
                </Container>
            </Navbar>

            <div
                className={`custom-overlay ${showOffcanvas ? "overlay-active" : ""}`}
                onClick={handleCloseOffcanvas}
            ></div>

      {/* Offcanvas Component */}
      <Offcanvas
        backdrop={false}
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement="start"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img
              src={isMobile ? ReserqLogoBlack : ReserqLogo}
              alt="ReservQ Logo"
            />{" "}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link to="/home" as={NavLink}>
              {t('navbar.home')}
            </Nav.Link>
            <Nav.Link to="/menu" as={NavLink}>
              {t('navbar.menu')}
            </Nav.Link>
            <Nav.Link to="/blog" as={NavLink}>
              {t('navbar.blog')}
            </Nav.Link>
            <Nav.Link to="/about" as={NavLink}>
              {t('navbar.about')}
            </Nav.Link>
            <Nav.Link to="/contact" as={NavLink}>
              {t('navbar.contact')}
            </Nav.Link>
            <Nav.Link to="/reservation" as={NavLink}>
              {t('reservation.title')}
            </Nav.Link>
            {role === "admin" && (
              <Nav.Link to="/admin" as={NavLink}>
                {t('navbar.adminDashboard')}
              </Nav.Link>
            )}
            {role === "user" && (
              <Nav.Link to="/dashboard" as={NavLink}>
                {t('navbar.userDashboard')}
              </Nav.Link>
            )}
            {isLoggedIn ? (
              <div className="d-flex flex-column gap-2 mt-3">
                <button
                  onClick={handleLogout}
                  className="logout-btn rounded text-white fs-5 w-100 py-2"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2 mt-3">
                <Nav.Link to="/login" as={NavLink} className="w-100">
                  <Button className="login-button w-100">{t('navbar.login')}</Button>
                </Nav.Link>
                <Nav.Link to="/signup" as={NavLink} className="w-100">
                  <Button className="signup-button w-100">{t('navbar.signup')}</Button>
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBar;
