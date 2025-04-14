import React, { useState } from 'react';
import { useNavigate,Route,Routes } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import {toast} from 'react-toastify'
function ReservationForm() {
  const API_URL = `${process.env.REACT_APP_URL}/api/v1`;
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    hour: '',
    location: '',
    numberOfGuests: ''
  });


  const handleChange = (e) => {
    console.log(e.target.name)
    if (e.target.name === 'date') {
      if (e.target.value < new Date().toISOString().split('T')[0]) {
        toast.error(t('reservation.dateError'));
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!formData.date || !formData.hour || !formData.location || !formData.numberOfGuests) {
      toast.error(t('reservation.fieldError'));
      return
    }
    try {
      const response = await fetch(`${API_URL}/reservation/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        navigate('/Thanks');
      } else {
        toast.error(t('reservation.fetchError'))
      }

    } catch (error) {
      toast.error(t('reservation.fetchError'))
      }
     
  
  };

  return (
    <Container className="py-5 mb-5">
      <h2 className="text-center mb-4">
       {t('reservation.makeReservation')} <FontAwesomeIcon icon={faConciergeBell} className="me-2" size="x" />
      </h2>
      <Form>
        <Row className="mb-3">
          <Col><Form.Control type="date" name="date" onChange={handleChange} required placeholder={t('reservation.selectDate')} /></Col>
          <Col>
            <Form.Select name="hour" onChange={handleChange} required>
              <option value="">{t('reservation.selectTime')}</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
              <option>4:00 PM</option>
              <option>5:00 PM</option>
              <option>6:00 PM</option>
              <option>7:00 PM</option>
              <option>8:00 PM</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Select name="location" onChange={handleChange} required>
              <option value="">{t('reservation.selectLocation')}</option>
              <option value={"Indoor"}>{t('reservation.indoor')}</option>
              <option value={"Outdoor"}>{t('reservation.outdoor')}</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select name="numberOfGuests" onChange={handleChange} required>
              <option value="">{t('reservation.selectPartySize')}</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8+</option>
            </Form.Select>
          </Col>
        </Row>
        <Button type="button" variant="danger" className="w-100" onClick={handleContinue}>{t('reservation.reserve')}</Button>
      </Form>
    </Container>
    
  );
}


export default ReservationForm;