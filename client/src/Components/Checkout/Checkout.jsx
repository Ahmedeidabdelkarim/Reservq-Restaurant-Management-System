import React, { useState, useEffect } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { BsExclamationTriangleFill } from "react-icons/bs"; // Bootstrap icon
import { Container, Row, Col, Card, Button, Form,Modal } from "react-bootstrap";
import "./Checkout.css";
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../NavBar/NavBar";
import Banner from "../Banner/Banner";
import Find from "../FindOut/Find";
import Footer from "../Footer/Footer";
import { useTranslation } from'react-i18next';
import { useStripe, useElements,CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { toast } from "react-toastify";

const Checkout = () => {
    const API_URL = `${process.env.REACT_APP_URL}/api/v1`;
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const navigate = useNavigate();
    const location = useLocation();
    const totalprice = location.state?.totalPrice || 0;
    const checkedItems = location.state?.checkedProducts || {}; 
    const [loading, setLoading] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    // Fetch user profile data and shipping address
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const profileData = await response.json();
                console.log('Profile data:', profileData);

                // Get shipping address from localStorage
                const savedShippingAddress = localStorage.getItem('shippingAddress');
                const shippingData = savedShippingAddress ? JSON.parse(savedShippingAddress) : null;

                // Update billing address with profile data
                setBillingAddress({
                    fullName: `${profileData.firstName} ${profileData.lastName}`,
                    email: profileData.email,
                    phone: profileData.phone,
                    country: profileData.country,
                    state: profileData.state,
                    city: profileData.city,
                    address: profileData.address,
                });

                // Update shipping address with localStorage data if available, otherwise use profile data
                setShippingAddress({
                    fullName: shippingData ? `${shippingData.firstName} ${shippingData.lastName}` : `${profileData.firstName} ${profileData.lastName}`,
                    email: profileData.email,
                    phone: shippingData?.phone || profileData.phone,
                    country: shippingData?.country || profileData.country,
                    state: shippingData?.state || profileData.state,
                    city: shippingData?.city || profileData.city,
                    address: shippingData?.address || profileData.address,
                });

                // Update form data with billing address
                setFormData(billingAddress);

            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    /*Payment Method*/
    const [selectedMethod, setSelectedMethod] = useState("creditCard");
    const [cardDetails, setCardDetails] = useState({
      cardNumber: "",
      expiry: "",
      cvv: "",
    });

  
    const handleInputChangee = (e) => {
      const { name, value } = e.target;
      setCardDetails({ ...cardDetails, [name]: value });
    };
  /*==Payment Method== */

  /* DeliveryMethod */
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("delivery");
  
  const deliveryCharge = selectedDeliveryMethod === "delivery" ? 3 : 0;
  
  /*==DeliveryMethod== */
  /*entered coupon */
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const validCoupons = {
    "SAVE10": 10,  // 10% Discount
    "DISCOUNT20": 20, // 20% Discount
    "FREEDELIVERY": 5  // Flat $5 Off
  };

  const discountedTotal = totalprice - (totalprice * discount) / 100;

  const finalTotal = discountedTotal + deliveryCharge;

  const handleApplyCoupon = () => {
    if (validCoupons[couponCode]) {
      const discountValue = validCoupons[couponCode];
      setDiscount(discountValue);
      alert(t('cardAddress.coupon.success', { discount: discountValue }));
    } else {
      setDiscount(0);
      alert(t('cardAddress.coupon.invalid'));
    }
  };

  

  /*coupon */
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("billing");

  const [billingAddress, setBillingAddress] = useState({
      fullName: "Jost Batler",
      email: "jostbatler@gmail.com",
      phone: "+1707 797 0462",
      country: "Bangladesh",
      state: "Dhaka",
      city: "Dhaka",
      address: "Mirpur-11, Dhaka, Bangladesh",
    });
  
    const [shippingAddress, setShippingAddress] = useState({
      fullName: "Jost Batler",
      email: "jostbatler@gmail.com",
      phone: "+1804 000 5262",
      country: "Bangladesh",
      state: "Narayanganj",
      city: "Narayanganj",
      address: "Rupganj-1460, Narayanganj",
    });

    const [formData, setFormData] = useState(billingAddress);

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedAddressType === "billing") {
            try {
                // Update billing address in state
                setBillingAddress(formData);

                // Prepare the data for API update
                const updateData = {
                    firstName: formData.fullName.split(' ')[0],
                    lastName: formData.fullName.split(' ').slice(1).join(' '),
                    address: formData.address,
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    phone: formData.phone
                };

                // Make API call to update profile
                const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/profile`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(updateData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                const updatedProfile = await response.json();
                console.log('Profile updated successfully:', updatedProfile);
                
                // Show success message
                alert('Billing address updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update billing address. Please try again.');
            }
        } else {
            setShippingAddress(formData);
            // Save shipping address to localStorage
            const shippingData = {
                firstName: formData.fullName.split(' ')[0],
                lastName: formData.fullName.split(' ').slice(1).join(' '),
                address: formData.address,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                phone: formData.phone
            };
            localStorage.setItem('shippingAddress', JSON.stringify(shippingData));
        }

        // Return to Address List
        setIsAddingAddress(false);
    };

    
   const [showLoginModal, setShowLoginModal] = useState(false); // State for modal
    // State for field completion
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);

  // Separate error states for each input
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [cardCvcError, setCardCvcError] = useState('');

  // State for alerts
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  // Handlers for individual card element changes
  const handleCardNumberChange = (event) => {
    setCardNumberComplete(event.complete);
    setCardNumberError(event.error ? event.error.message : '');
  };

  const handleCardExpiryChange = (event) => {
    setCardExpiryComplete(event.complete);
    setCardExpiryError(event.error ? event.error.message : '');
  };

  const handleCardCvcChange = (event) => {
    setCardCvcComplete(event.complete);
    setCardCvcError(event.error ? event.error.message : '');
  };

    const handlePayment = async (item) => {
        const user = localStorage.getItem("role"); // Get user from localStorage
    
        if (!user) {
          setShowLoginModal(true); // Show login modal if user not found
          return;
        }
    
        // User found, proceed with payment
        if (selectedMethod === "paypal"){
          try{
            setIsProcessingPayment(true);
            const paymentData = await fetch(`${API_URL}/order/add`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ products: checkedItems.map(
                (item) => ({
                  productId : item.id,
                  quantity : item.quantity
                })),
                paymentMethod: "paypal",
                address: shippingAddress.address,
                deliveryType:selectedDeliveryMethod,
              })

              
            })
              
            if (!paymentData.ok) {
              throw new Error('Error creating order , maybe product is out of stock');
            }
            
            const payment = await paymentData.json();
            const link = payment.links.filter((link) => link.rel === "payer-action")[0].href;
            if (link) {
              setIsProcessingPayment(false);
              window.location.replace(link);
            }
          }
          catch(error){
            setIsProcessingPayment(false);
            toast.error(error.message);
          }
          
        } 
        else if (selectedMethod === "creditCard"){
          if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
            setAlertMessage('Please complete the card details');
            setAlertVariant('warning');
            return;
          }

          setAlertMessage('');

          try{
            setIsProcessingPayment(true);
            const paymentData = await fetch(`${API_URL}/order/add`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ products: checkedItems.map(
                (item) => ({
                  productId : item.id,
                  quantity : item.quantity
                })),
                paymentMethod: "card",
                address: shippingAddress.address,
                deliveryType:selectedDeliveryMethod,
              })
        } )
            if (!paymentData.ok) {
              throw new Error('Error creating order , check your card details');
            }
            
            
            const payment = await paymentData.json();
            const client_secret = payment.clientSecret;
            const cardNumberElement = elements.getElement(CardNumberElement);
            const cardExpiryElement = elements.getElement(CardExpiryElement);
            const cardCvcElement = elements.getElement(CardCvcElement);

            if (client_secret) {
              const result =await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                  card: cardNumberElement,
                  exp_month: cardExpiryElement._maskedExpMonth,
                  exp_year: cardExpiryElement._maskedExpYear,
                  cvc: cardCvcElement._maskedCVC,
                }
              })

              if (result.error){
                setIsProcessingPayment(false);
                toast.error(result.error.message);
              }else{
                if (result.paymentIntent.status === "succeeded") {
                setIsProcessingPayment(false);
                toast.success("Payment Processed successful");
                navigate("/home");
                }
              }
            }
          }
          catch(error){
            setIsProcessingPayment(false);
            toast.error(error.message);
          }
        }
        
      
      };
      const CARD_ELEMENT_OPTIONS = {
        style: {
          base: {
            // Define font, color, etc.
            color: '#495057',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            '::placeholder': {
              color: '#adb5bd',
            },
            // Custom layout styles
            display: 'block',       // Forces a block-level display
            width: '100%',
            padding: '12px 14px',    // Adds inner spacing for better readability
            lineHeight: '1.5',       // Improves the vertical spacing of the text
            marginBottom: '10px',    // Adds some spacing below the element
            border: '1px solid #ced4da',
            borderRadius: '2px',
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
        hidePostalCode: true, // Optional: hides postal code field if not needed
      };
      
return (
  <>
    <NavBar />
    <Banner pageName={t('cardAddress.title')} />
    <Container className="my-4 py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Row>
        {/* Addresses */}
        <Col md={8} sm={12} className={`text-${isRTL ? 'end' : 'start'}`}>
          <h3>{t('cardAddress.addresses')}</h3>
          {loading ? (
              <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </div>
              </div>
          ) : (
              <>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                    <div className="shopping-cart-address-btn-top mb-3">
                      <Button
                        variant={selectedAddressType === "billing" ? "danger" : "outline-none"}
                        className={`${isRTL ? 'ms-2' : 'me-2'}`}
                        onClick={() => setSelectedAddressType("billing")}
                      >
                        {t('cardAddress.billingAddress')}
                      </Button>
                      <Button
                        variant={selectedAddressType === "shipping" ? "danger" : "outline-none"}
                        onClick={() => setSelectedAddressType("shipping")}
                      >
                        {t('cardAddress.shippingAddress')}
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="outline-dark"
                        className="p-3 mt-2"
                        onClick={() => {
                          setIsAddingAddress(true);
                          setFormData(
                            selectedAddressType === "billing"
                              ? billingAddress
                              : shippingAddress
                          ); // Reset form
                        }}
                      >
                        {t('cardAddress.addNew')}
                      </Button>
                    </div>
                  </div>
                  {/* Add New Address Modal */}
                  {isAddingAddress ? (
                    <Row>
                      <Card className="py-3 px-0">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-3">
                              {t('cardAddress.edit')}{" "}
                              {selectedAddressType === "billing"
                                ? t('cardAddress.billingAddress')
                                : t('cardAddress.shippingAddress')}
                            </h5>
                            <button
                              className="btn btn-secondary mb-3"
                              onClick={() => setIsAddingAddress(false)}
                            >
                              <IoReturnUpBack className="me-2 fs-3" />
                              {t('cardAddress.back')}
                            </button>
                          </div>

                          <Form
                            onSubmit={handleFormSubmit}
                            className="bg-light rounded p-3"
                          >
                            <Row>
                              <Col lg={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.fullName')}</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.email')}</Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.phone')}</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.country')}</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.state')}</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.city')}</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>{t('cardAddress.form.address')}</Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <div className="d-flex justify-content-end">
                                <Button
                                  className="mt-3 p-3"
                                  type="submit"
                                  variant="danger"
                                >
                                  {t('cardAddress.form.saveAddress')}
                                </Button>
                              </div>
                            </Row>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Row>
                  ) : (
                    <Row>
                      <Col md={6}>
                        <Card className=" mb-3 billing-address">
                          <Card.Body>
                            <h5>{t('cardAddress.billingAddress')} #1</h5>
                            <p>
                              <strong>{t('cardAddress.form.fullName')}:</strong>
                              {billingAddress.fullName}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.email')}:</strong> {billingAddress.email}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.phone')}:</strong> {billingAddress.phone}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.country')}:</strong> {billingAddress.country}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.state')}:</strong> {billingAddress.state}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.city')}:</strong> {billingAddress.city}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.address')}:</strong> {billingAddress.address}
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6}>
                        <Card className="mb-3 bg-light border-0">
                          <Card.Body>
                            <h5>{t('cardAddress.shippingAddress')} #2</h5>
                            <p>
                              <strong>{t('cardAddress.form.fullName')}:</strong>
                              {shippingAddress.fullName}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.email')}:</strong> {shippingAddress.email}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.phone')}:</strong> {shippingAddress.phone}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.country')}:</strong> {shippingAddress.country}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.state')}:</strong> {shippingAddress.state}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.city')}:</strong> {shippingAddress.city}
                            </p>
                            <p>
                              <strong>{t('cardAddress.form.address')}:</strong> {shippingAddress.address}
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <h3 className="mb-3">{t('cardAddress.payment.title')}</h3>
                      <Row>
                        <Card className="p-4">
                          <div className="payment-options d-flex mb-3">
                            <Button
                              variant={
                                selectedMethod === "creditCard" ? "danger" : "light"
                              }
                              className="me-2"
                              onClick={() => setSelectedMethod("creditCard")}
                            >
                              <FaCcVisa color="#1E90FF" className="me-1 fs-1" />
                              <FaCcMastercard color="#DC143C" className="me-1 fs-1" />
                              <FaCcAmex color="#FFD700" className="fs-1" />
                            </Button>
                            <Button
                              variant={
                                selectedMethod === "paypal" ? "danger" : "light"
                              }
                              onClick={() => setSelectedMethod("paypal")}
                            >
                              <FaPaypal color="#0072C6" className="me-1 fs-1" />{" "}
                              {t('cardAddress.payment.paypal')}
                            </Button>
                          </div>

                          {selectedMethod === "creditCard" && (
                            <Form>
                              <Form.Group className="mb-3">
                                <Form.Label>{t('cardAddress.payment.creditCard.cardNumber')}</Form.Label>
                                <div className="form-control">
                                  <CardNumberElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardNumberChange}  />
                                </div>
                                {cardNumberError && <div className="text-danger mt-1">{cardNumberError}</div>}

                              </Form.Group>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>{t('cardAddress.payment.creditCard.expiryDate')}</Form.Label>
                                    <div className="form-control">
                                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardExpiryChange}  />
                                    </div>
                                  {cardExpiryError && <div className="text-danger mt-1">{cardExpiryError}</div>}

                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>{t('cardAddress.payment.creditCard.cvv')}</Form.Label>
                                    <div className="form-control">
                                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardCvcChange}  />
                                    </div>
                                    {cardCvcError && <div className="text-danger mt-1">{cardCvcError}</div>}

                                  </Form.Group>
                                </Col>
                              </Row>
                              <Form.Check
                                type="checkbox"
                                label={t('cardAddress.payment.creditCard.saveCard')}
                              />
                            </Form>
                          )}

                          <div className="mt-3">
                            <h5>{t('cardAddress.order.title')}</h5>
                            <p>{t('cardAddress.order.subtotal')}: {totalprice}</p>
                            <h5>
                              <strong>{t('cardAddress.order.total')}: ${finalTotal.toFixed(2)}</strong>
                            </h5>
                          </div>
                          <Button variant="danger" className="w-100 mt-3" onClick={handlePayment}>
                            {isProcessingPayment ? t('cardAddress.payment.processing'): t('cardAddress.payment.paySecurely')}
                          </Button>
                        </Card>
                      </Row>
                    </Row>
                  )}
                </>
              )}
        </Col>

        {/* Cart Summary - Fixed in Right Column */}
        <Col md={4} sm={12} className={`text-${isRTL ? 'end' : 'start'}`}>
          <h3 dir={isRTL ? 'rtl' : 'ltr'} className={`mb-3 text-${isRTL ? 'end' : 'start'}`}>{t('cardAddress.cartSummary.title')}</h3>
          <div className="d-flex mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
            <Button
              variant={
                selectedDeliveryMethod === "delivery" ? "danger" : "light"
              }
              className={`${isRTL ? 'ms-2' : 'me-2'}`}
              onClick={() => setSelectedDeliveryMethod("delivery")}
            >
              {t('cardAddress.cartSummary.delivery')}
            </Button>
            <Button
              variant={
                selectedDeliveryMethod === "pickup" ? "danger" : "light"
              }
              className={`${isRTL ? 'ms-2' : 'me-2'}`}
              onClick={() => setSelectedDeliveryMethod("pickup")}
            >
              {t('cardAddress.cartSummary.pickup')}
            </Button>
            <Button
              variant={selectedDeliveryMethod === "restaurant" ? "danger" : "light"}
              onClick={() => setSelectedDeliveryMethod("in-restaurant")}
            >
              {t('cardAddress.cartSummary.inRestaurant')}
            </Button>
          </div>

          {/* Cart Summary */}
          {console.log("Checked Items:", checkedItems)}

          {checkedItems.length > 0 ? (
            checkedItems.map((item, index) => (
              <Card key={index} className="mb-3 " dir={isRTL ? 'rtl' : 'ltr'}>
                <Row className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Col md={4} xs={4}>
                    <img
                      src={item.images[0]}
                      alt="Eggplant Baked with Cheese"
                      className="ms-2 h-100 w-100 rounded"
                    />
                  </Col>
                  <Col md={8} xs={8} dir={isRTL?'rtl':'ltr'}>
                    <Card.Body className="word-wrap">
                      <h6 className="m-0 p-0">{item.name}</h6>
                      <p className="m-0 p-0">
                        <strong>{t('cardAddress.cartSummary.size')} :</strong> {item.size}
                      </p>
                      <p className="m-0 p-0">
                        <strong>{t('cardAddress.cartSummary.price')} :</strong> ${item.price}
                      </p>
                      <p className="m-0 p-0">
                        <strong>{t('cardAddress.cartSummary.quantity')} :</strong> {item.quantity}
                      </p>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <p>No items in cart</p>
          )}
          <Card className="mt-3">
            <Card.Body>
              <h5 dir={isRTL ? 'rtl' : 'ltr'}>{t('cardAddress.coupon.title')}</h5>
              <div className="d-flex mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder={t('cardAddress.cartSummary.placeholder')}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="danger" className={isRTL?'me-1':'ms-1'} onClick={handleApplyCoupon}>
                  {t('cardAddress.cartSummary.apply')}
                </Button>
              </div>
              <div className="mb-2">
                <div className={`d-flex justify-content-between`}>
                  <span>{t('cardAddress.cartSummary.subtotal')}</span>
                  <span>${totalprice}</span>
                </div>
                <div className={`d-flex justify-content-between mb-2`}>
                  <span>{t('cardAddress.cartSummary.discount')}</span>
                  <span>{discount}%</span>
                </div>

                <div className={`d-flex justify-content-between mb-2`}>
                  <span>{t('cardAddress.cartSummary.delivery')}</span>
                  <span>${deliveryCharge.toFixed(2)}</span>
                </div>

                <div className={`d-flex justify-content-between fw-bold`}>
                  <span>{t('cardAddress.cartSummary.total')}</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              {/* <Button variant="danger" className="w-100">
                {t('cardAddress.summary.placeOrder')}
              </Button> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>


      
    {/* Login Required Modal */}
    <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
<Modal.Header closeButton>
  <Modal.Title>
    <BsExclamationTriangleFill className="text-warning me-2" />
    Login Required
  </Modal.Title>
</Modal.Header>
<Modal.Body>
  <p className="text-center">
    <BsExclamationTriangleFill className="text-danger me-2" size={20} />
    You need to be logged in to add items to the cart.
  </p>
</Modal.Body>
<Modal.Footer>
  <Button className="py-2" variant="secondary" onClick={() => setShowLoginModal(false)}>
    Close
  </Button>
  <Button
    onClick={() => {
      if (navigate) {
        navigate("/login");
      } else {
        window.location.href = "/login"; // Fallback for non-router cases
      }
    }}
    variant="danger"
    size="sm"
  >
    <BsExclamationTriangleFill className="me-1" />
    Login
  </Button>
</Modal.Footer>
</Modal>
    </Container>
    <Find />
    <Footer />
  </>
);
};

export default Checkout;
