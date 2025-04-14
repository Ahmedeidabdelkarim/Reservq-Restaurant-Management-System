import React, { useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const form = useRef();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_mm3qkqp', 'template_pbecjrc', form.current, 'BtLPbEY7OdtmNYIw5')
      .then((result) => {
        toast.success(t('contact.form.contactInfo.success'));
        form.current.reset();
      }, (error) => {
        toast.error(t('contact.form.contactInfo.error'));
      });
  };

  return (
    <section className="py-5 bg-light" dir={isRTL ? 'rtl' : 'ltr'}>
      <Container>
        <Row className="gy-4">
          {/* Contact Info */}
          <Col md={5}>
            <h2 className={`text-${isRTL ? 'end' : 'start'} fs-1 p-3 fw-bold`}>
              {t('contact.form.title')}
            </h2>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Body className="d-flex align-items-start">
                <FaPhoneAlt className={`text-danger fs-2 ${isRTL ? 'ms-3' : 'me-3'}`} />
                <div className={`text-${isRTL ? 'end' : 'start'}`}>
                  <h6>{t('contact.form.contactInfo.title')}</h6>
                  <p className="mb-0">{t('contact.form.contactInfo.description')}</p>
                  <p className="fw-bold mb-0">+1 707 797 0462</p>
                </div>
              </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-start">
                <FaEnvelope className={`text-danger fs-2 ${isRTL ? 'ms-3' : 'me-3'}`} />
                <div className={`text-${isRTL ? 'end' : 'start'}`}>
                  <h6>{t('contact.form.contactInfo.email')}</h6>
                  <p className="mb-0">ah.eid.gw14@gmail.com</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Form */}
          <Col md={7}>
            <Card className="border-0 shadow-sm p-1">
              <Form ref={form} onSubmit={sendEmail}>
                <Row className="gy-3 page2 p-4">
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label className={`text-${isRTL ? 'end' : 'start'} d-block`}>{t('contact.form.contactInfo.firstName')}</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="firstName" 
                        placeholder={t('contact.form.placeholders.firstName')} 
                        className={`text-${isRTL ? 'end' : 'start'}`}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label className={`text-${isRTL ? 'end' : 'start'} d-block`}>{t('contact.form.contactInfo.lastName')}*</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="lastName" 
                        placeholder={t('contact.form.placeholders.lastName')} 
                        required 
                        className={`text-${isRTL ? 'end' : 'start'}`}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label className={`text-${isRTL ? 'end' : 'start'} d-block`}>{t('contact.form.contactInfo.email')}*</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email" 
                        placeholder={t('contact.form.placeholders.email')} 
                        required 
                        className={`text-${isRTL ? 'end' : 'start'}`}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label className={`text-${isRTL ? 'end' : 'start'} d-block`}>{t('contact.form.contactInfo.phone')}*</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="phone" 
                        placeholder={t('contact.form.placeholders.phone')} 
                        required 
                        className={`text-${isRTL ? 'end' : 'start'}`}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="description">
                      <Form.Label className={`text-${isRTL ? 'end' : 'start'} d-block`}>{t('contact.form.contactInfo.message')}*</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        rows={4}
                        placeholder={t('contact.form.placeholders.message')}
                        required
                        className={`text-${isRTL ? 'end' : 'start'}`}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className={`text-${isRTL ? 'end' : 'start'}`}>
                    <Button variant="danger" type="submit" className="p-2">
                      {t('contact.form.contactInfo.submit')}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactForm;