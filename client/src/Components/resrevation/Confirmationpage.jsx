import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reservation confirmed:', { ...data, ...contact });
    navigate('/Thanks');
  };

  return (
    <Container className="py-5 mb-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className={`text-center mb-4 ${isRTL ? 'text-end' : 'text-start'}`}>
        {t('confirmation.title')} <CheckCircleFill color="green" />
      </h3>
      <p className={`text-center ${isRTL ? 'text-end' : 'text-start'}`}>
        {t('confirmation.bookingDetails', { partySize: data?.partySize, date: data?.date, time: data?.time, location: data?.location })}
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control 
            type="text" 
            placeholder={t('confirmation.namePlaceholder')} 
            name="name" 
            onChange={handleChange} 
            required 
            className={`text-${isRTL ? 'end' : 'start'}`}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control 
            type="tel" 
            placeholder={t('confirmation.phonePlaceholder')} 
            name="phone" 
            onChange={handleChange} 
            required 
            className={`text-${isRTL ? 'end' : 'start'}`}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control 
            type="email" 
            placeholder={t('confirmation.emailPlaceholder')} 
            name="email" 
            onChange={handleChange} 
            required 
            className={`text-${isRTL ? 'end' : 'start'}`}
          />
        </Form.Group>
        <Button type="submit" variant="danger" className="w-100">
          {t('confirmation.bookNow')}
        </Button>
      </Form>
    </Container>
  );
}

export default ConfirmationPage