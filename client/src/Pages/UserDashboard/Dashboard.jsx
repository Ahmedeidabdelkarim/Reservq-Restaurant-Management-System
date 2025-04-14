import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Table, Badge, Modal, Alert } from 'react-bootstrap';
import { FaUserEdit, FaMapMarkerAlt, FaClipboardList, FaHeart, FaLock, FaSignOutAlt, FaTrash, FaEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import NavBar from '../../Components/NavBar/NavBar';
import Banner from '../../Components/Banner/Banner';
import Faq from '../../Components/Faq/Faq';
import Footer from '../../Components/Footer/Footer';
import AddressManagement from './AddressManagement';
import { useFavoriteContext } from "../../Contexts/FavoriteContext";
import { useCartContext } from '../../Contexts/CartContext';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [role, setRole] = useState(null);
    const { addToCart } = useCartContext();
    const { favorites, setFavorites, setFavoriteNum } = useFavoriteContext();
    const [activeTab, setActiveTab] = useState('editProfile');
    const [showLogout, setShowLogout] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');

    useEffect(() => {
        // Fetch user profile data from the API
        fetch(`${process.env.REACT_APP_URL}/api/v1/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((profileData) => {
                console.log('Profile data:', profileData);
                setData(profileData);
                // Also update the form data with the fetched profile information
                setFormData({
                    firstName: profileData.firstName || '',
                    lastName: profileData.lastName || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    country: profileData.country || '',
                    state: profileData.state || '',
                    city: profileData.city || '',
                    address: profileData.address || '',
                    profileImage: profileData.profileImage || '',
                    profileImageFile: null,
                });
                // Store the fetched profile data in localStorage for persistence
                localStorage.setItem('data', JSON.stringify(profileData));
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                // If API fails, try to load from localStorage as fallback
                const localData = JSON.parse(localStorage.getItem('data'));
                if (localData) {
                    setData(localData);
                    setFormData({
                        firstName: localData.firstName || '',
                        lastName: localData.lastName || '',
                        email: localData.email || '',
                        phone: localData.phone || '',
                        country: localData.country || '',
                        state: localData.state || '',
                        city: localData.city || '',
                        address: localData.address || '',
                        profileImage: localData.profileImage || '',
                        profileImageFile: null,
                    });
                }
            });
    }, []);

    const removeFromFavorites = (itemId) => {
        const updatedFavorites = favorites.filter((item) => item.id !== itemId);
        setFavorites(updatedFavorites);
        setFavoriteNum(updatedFavorites.length);
    }
    
    useEffect(() => {
        setRole(localStorage.getItem('role'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('data');
        setRole(null);
        navigate('/login');
    }
    
    const handleCloseLogout = () => {
        setShowLogout(false);
    };

    /*Handel Form Data */
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        address: '',
        profileImage: '',
        profileImageFile: null,
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                profileImageFile: file,
                profileImage: URL.createObjectURL(file)
            });
        }
    };
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const updateProfile = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Create FormData object for file upload
            const formDataToSend = new FormData();
            
            // List of fields that can be updated
            const editableFields = [
                'firstName',
                'lastName',
                'email',
                'phone',
                'country',
                'state',
                'city',
                'address'
            ];

            // Add text fields to FormData
            editableFields.forEach(field => {
                if (formData[field] !== data[field]) {
                    formDataToSend.append(field, formData[field]);
                }
            });

            // Handle profile image file upload
            if (formData.profileImageFile) {
                formDataToSend.append('profileImage', formData.profileImageFile);
            }

            const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formDataToSend,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update profile');
            }

            // Update local storage and state with the new data
            localStorage.setItem('data', JSON.stringify(result));
            setData(result);
            
            // Show success message
            setError('Profile updated successfully!');
            
            // Optional: Reload after delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /*Handel Change Password */
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const validatePasswordForm = () => {
        if (!passwordForm.newPassword) {
            setPasswordError('New password is required');
            return false;
        }
        if (!passwordForm.confirmPassword) {
            setPasswordError('Please confirm your new password');
            return false;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return false;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const updatePassword = async () => {
        if (!validatePasswordForm()) return;

        setIsPasswordLoading(true);
        setPasswordError("");
        setPasswordSuccess("");

        try {
            const payload = {
                password: passwordForm.newPassword,
            };

            const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update password");
            }

            setPasswordSuccess("Password updated successfully!");
            setPasswordForm({ newPassword: "", confirmPassword: "" });
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setPasswordSuccess("");
            }, 3000);
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordError(error.message || "Failed to update password. Please try again.");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    // Add this new useEffect for fetching orders
    useEffect(() => {
        const fetchOrders = async () => {
            setIsOrdersLoading(true);
            setOrdersError('');
            try {
                const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/user/orders`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                console.log('Fetched orders:', data);
                
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrdersError('Failed to load orders. Please try again later.');
            } finally {
                setIsOrdersLoading(false);
            }
        };

        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    return (
        <>
            <NavBar />
            <Banner pageName={t('dashboard.title')} />
            <Container className="dashboard-container py-5 mb-5" dir={isRTL ? 'rtl' : 'ltr'}>
                <Row>
                    <Col md={3} className={`sidebar p-4 ${isRTL ? 'text-end' : 'text-start'} bg-light mb-sm-3`}>
                        <div className="profile text-center">
                            <img
                                src={data.profileImage || "https://reservq.vercel.app/assets/dashboard-menu-profile-img-c3af5256.png"}
                                alt="Profile"
                                className="rounded-circle"
                            />
                            <h5>
                                {role === "admin"
                                    ? t('dashboard.admin')
                                    : `${data?.firstName || ''} ${data?.lastName || ''}`
                                }
                            </h5>
                            <p>{data?.email}</p>
                        </div>
                        <ul className="nav flex-column">
                            <li
                                className={`nav-Item ${activeTab === "editProfile" ? "active" : ""}`}
                                onClick={() => setActiveTab("editProfile")}
                            >
                                <FaUserEdit className={isRTL ? 'ms-2' : 'me-2'} /> {t('dashboard.editProfile')}
                            </li>
                            <li
                                className={`nav-Item ${activeTab === "address" ? "active" : ""}`}
                                onClick={() => setActiveTab("address")}
                            >
                                <FaMapMarkerAlt className={isRTL ? 'ms-2' : 'me-2'} /> {t('dashboard.address')}
                            </li>
                            <li
                                className={`nav-Item ${activeTab === "orders" ? "active" : ""}`}
                                onClick={() => setActiveTab("orders")}
                            >
                                <FaClipboardList className={isRTL ? 'ms-2' : 'me-2'} /> {t('dashboard.orders')}
                                {data?.orders > 0 && <span className={isRTL ? 'float-start' : 'float-end'}>({data.orders})</span>}
                            </li>
                            <li
                                className={`nav-Item ${activeTab === "wishlist" ? "active" : ""}`}
                                onClick={() => setActiveTab("wishlist")}
                            >
                                <FaHeart className={isRTL ? 'ms-2' : 'me-2'} /> {t('dashboard.wishlist')}
                                <span className={isRTL ? 'float-start' : 'float-end'}>({favorites.length})</span>
                            </li>
                            <li
                                className={`nav-Item ${activeTab === "changePassword" ? "active" : ""}`}
                                onClick={() => setActiveTab("changePassword")}
                            >
                                <FaLock className={isRTL ? 'ms-2' : 'me-2'} /> {t('dashboard.changePassword')}
                            </li>
                            <li className="nav-Item" onClick={() => setShowLogout(true)}>
                                <FaSignOutAlt className={isRTL ? 'ms-2' : 'me-2'} /> {t('dashboard.logout')}
                            </li>
                        </ul>
                    </Col>
                    <Col md={9} className={isRTL ? 'text-end' : 'text-start'}>
                        <h3>{t('dashboard.dashboard')}</h3>
                        <p>{t('dashboard.welcome')}</p>
                        
                        {activeTab === "editProfile" && (
                            <Form
                                className={`w-100 bg-light p-4 ${isRTL ? 'text-end' : 'text-start'}`}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    updateProfile();
                                }}
                            >
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('dashboard.profileImage')}</Form.Label>
                                    <div className={`d-flex align-items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <img 
                                            src={formData.profileImage || data.profileImage || "https://reservq.vercel.app/assets/dashboard-menu-profile-img-c3af5256.png"} 
                                            alt="Profile" 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} 
                                            onError={(e) => {
                                                e.target.src = "https://reservq.vercel.app/assets/dashboard-menu-profile-img-c3af5256.png";
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <small className="text-muted">{t('dashboard.imageNote')}</small>
                                        </div>
                                    </div>
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.firstName')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                placeholder={t('dashboard.firstName')}
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.lastName')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                placeholder={t('dashboard.lastName')}
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.email')}</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder={t('dashboard.email')}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.phone')}</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                placeholder="+1707 797 0462"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.country')}</Form.Label>
                                            <Form.Select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                            >
                                                <option>{t('dashboard.selectCountry')}</option>
                                                <option>India</option>
                                                <option>United States</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.state')}</Form.Label>
                                            <Form.Select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                            >
                                                <option>{t('dashboard.selectState')}</option>
                                                <option>California</option>
                                                <option>New York</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.city')}</Form.Label>
                                            <Form.Select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            >
                                                <option>{t('dashboard.selectCity')}</option>
                                                <option>New York</option>
                                                <option>Los Angeles</option>
                                                <option>Dhaka</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('dashboard.address')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder={t('dashboard.address')}
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className={`mb-3 d-flex justify-content-between align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Button variant="danger" type="submit" disabled={isLoading}>
                                        {isLoading ? t('dashboard.saving') : t('dashboard.save')}
                                    </Button>
                                    {error && (
                                        <p className={`text-${error.includes('successfully') ? 'success' : 'danger'}`}>
                                            {error}
                                        </p>
                                    )}
                                </Form.Group>
                            </Form>
                        )}

                        {activeTab === "address" && (
                            <AddressManagement/>
                        )}

                        {activeTab === "orders" && (
                            <div className={`${isRTL ? 'text-end' : 'text-start'} w-100 bg-light mt-3 p-3`}>
                                <h4 className="mb-3">{t('dashboard.orders')}</h4>
                                {isOrdersLoading ? (
                                    <div className="text-center p-5">
                                        <p>{t('dashboard.loading')}</p>
                                    </div>
                                ) : ordersError ? (
                                    <div className="text-center p-5">
                                        <p className="text-danger">{ordersError}</p>
                                        <Button variant="danger" onClick={() => setActiveTab("orders")}>
                                            {t('dashboard.retry')}
                                        </Button>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <Table responsive variant="light">
                                        <thead>
                                            <tr>
                                                <th>{t('dashboard.orderId')}</th>
                                                <th>{t('dashboard.items')}</th>
                                                <th>{t('dashboard.date')}</th>
                                                <th>{t('dashboard.total')}</th>
                                                <th>{t('dashboard.status.title')}</th>
                                                <th>{t('dashboard.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>#{order.id.slice(-6)}</td>
                                                    <td>
                                                        {order.products.map(item => item.name).join(', ')}
                                                    </td>
                                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                                    <td>${order.total}</td>
                                                    <td>
                                                        <Badge
                                                            bg={
                                                                order.status === "delivered"
                                                                    ? "success"
                                                                    : order.status === "processing"
                                                                    ? "primary"
                                                                    : order.status === "pending"
                                                                    ? "warning"
                                                                    : order.status === "cancelled"
                                                                    ? "danger"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {t(`dashboard.status.${order.status}`)}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button 
                                                            variant="dark" 
                                                            size="sm"
                                                            onClick={() => {
                                                                console.log('View order:', order._id);
                                                            }}
                                                        >
                                                            <FaEye />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center p-5">
                                        <h5>{t('dashboard.noOrders')}</h5>
                                        <p>{t('dashboard.noOrdersText')}</p>
                                        <Button variant="danger" onClick={() => navigate('/menu')}>
                                            {t('dashboard.browseMenu')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <Row>
                                {favorites.length > 0 ? (
                                    favorites.map((item) => (
                                        <Col md={6} key={item.id} className="mb-4">
                                            <Card className={`shadow-sm d-flex flex-row align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <div
                                                    className="card-img-container"
                                                    style={{
                                                        width: "200px",
                                                        height: "200px",
                                                        overflow: "hidden",
                                                        borderRadius: isRTL ? "0px 10px 10px 0px" : "10px 0px 0px 10px",
                                                    }}
                                                >
                                                    <Card.Img
                                                        variant="top"
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        className="wishlist-img"
                                                    />
                                                </div>
                                                <Card.Body className={`wishlist-body ${isRTL ? 'text-end' : 'text-start'}`}>
                                                    <h5>{item.name}</h5>
                                                    <p>⭐{item.rating}</p>
                                                    <p className="mt-2">${item.price}</p>
                                                    <div className={`d-flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                        <Button
                                                            variant="dark"
                                                            onClick={() => {
                                                                addToCart(item);
                                                            }}
                                                        >
                                                            {t('dashboard.addToCart')}
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => removeFromFavorites(item.id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <div className={`text-center p-5 w-100 bg-light ${isRTL ? 'text-end' : 'text-start'}`}>
                                        <h5>{t('dashboard.emptyWishlist')}</h5>
                                        <p>{t('dashboard.emptyWishlistText')}</p>
                                        <Button variant="danger" onClick={() => navigate('/menu')}>
                                            {t('dashboard.browseMenu')}
                                        </Button>
                                    </div>
                                )}
                            </Row>
                        )}

                        {activeTab === "changePassword" && (
                            <div className={`change-password-container p-4 bg-light w-100 ${isRTL ? 'text-end' : 'text-start'}`}>
                                <h4>{t('dashboard.changePassword')}</h4>
                                {passwordSuccess && (
                                    <Alert variant="success" onClose={() => setPasswordSuccess("")} dismissible>
                                        {passwordSuccess}
                                    </Alert>
                                )}
                                {passwordError && (
                                    <Alert variant="danger" onClose={() => setPasswordError("")} dismissible>
                                        {passwordError}
                                    </Alert>
                                )}
                                <Form
                                    className="w-100"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updatePassword();
                                    }}
                                >
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t('dashboard.newPassword')} *</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="newPassword"
                                                    placeholder={t('dashboard.enterNewPassword')}
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordChange}
                                                    required
                                                    minLength={6}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t('dashboard.confirmPassword')} *</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    placeholder={t('dashboard.confirmNewPassword')}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    required
                                                    minLength={6}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button
                                        variant="danger"
                                        type="submit"
                                        disabled={isPasswordLoading}
                                        className="mt-3"
                                    >
                                        {isPasswordLoading ? t('dashboard.updating') : t('dashboard.updatePassword')}
                                    </Button>
                                </Form>
                            </div>
                        )}

                        <Modal show={showLogout} onHide={handleCloseLogout} centered>
                            <Modal.Body className="text-center p-4">
                                <FaSignOutAlt size={50} className="text-danger mb-3" />
                                <h4>{t('dashboard.logoutConfirm')}</h4>
                                <div className={`d-flex justify-content-center mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Button
                                        variant="light"
                                        className={isRTL ? 'ms-3' : 'me-3'}
                                        onClick={handleCloseLogout}
                                    >
                                        {t('dashboard.no')}
                                    </Button>
                                    <Button variant="danger" onClick={() => handleLogout()}>
                                        {t('dashboard.yes')}
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </Col>
                </Row>
            </Container>

            <Faq />
            <Footer />
        </>
    );
};

export default Dashboard;