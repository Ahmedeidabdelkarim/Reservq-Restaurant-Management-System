import React from "react";
import { Accordion, Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Faq.css";
import { useTranslation } from 'react-i18next';
/*images */

import faq1 from '../../assets/Faq/faq1.png'
import faq2 from '../../assets/Faq/faq2.png'
import faq3 from '../../assets/Faq/faq3.png'
import faq4 from '../../assets/Faq/faq4.png'

/*end images */

const Faq = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="faq-section">
    <Container className=" py-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Row>
        <Col lg={6}>
          <h2 className={`fw-bold mb-4 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>{t('faq.title')}</h2>
          <Accordion defaultActiveKey="0" className="faq-accordion custom-accordion">
            <Accordion.Item className="mb-3" eventKey="0">
              <Accordion.Header className={`custom-accordion-header ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('faq.questions.cuisine')}
              </Accordion.Header>
              <Accordion.Body className={`custom-accordion-body ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('faq.answers.cuisine')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="mb-3" eventKey="1">
              <Accordion.Header className={`custom-accordion-header ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('faq.questions.reservation')}
              </Accordion.Header>
              <Accordion.Body className={`custom-accordion-body ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('faq.answers.reservation')}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="mb-3" eventKey="2">
              <Accordion.Header className={`custom-accordion-header ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('faq.questions.dressCode')}
              </Accordion.Header>
              <Accordion.Body className={`custom-accordion-body ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t('faq.answers.dressCode')}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        
        <Col lg={6} className="text-center">
          <Row>
            <Col md={8} className="faq-card mb-3">
              <Card>
                <Card.Img variant="top" src={faq1} alt="Restaurant Interior" />
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="faq-card success-card h-100 w-100 object-fit-cover position-relative">
                <img className="w-100 h-100 object-fit-cover" src={faq2} alt="Restaurant Interior" />
                <div className="over-lay1 position-absolute top-0 start-0 w-100 h-100"></div>
                <h4 className="position-absolute top-50 start-50 translate-middle text-white fw-bold text-start">235+ Success Event</h4>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="faq-card success-card h-100 w-100 object-fit-cover">
                <img src={faq3} alt="Restaurant Interior" className="w-100 h-100 object-fit-cover"/>
                <div className="over-lay2 position-absolute top-0 start-0 w-100 h-100"></div>
                <h4 className="position-absolute top-50 start-50 translate-middle text-white fw-bold text-start">235+ Success Event</h4>
              </Card>
            </Col>
            <Col md={8} className="mb-3">
              <Card>
                <Card.Img variant="top" src={faq4} alt="Chef" />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>

    </div>
  );
};

export default Faq;
