import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Find.css";
import { useTranslation } from 'react-i18next';
import googlePlay from "../../assets/Find/mat.png";
import appStore from "../../assets/Find/store.png";
import phoneMockup from "../../assets/Find/Phone.png";

const Find = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="find-section" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Container className="food-experience-section">
        <Row className="align-items-center text-white">
          <Col lg={6} md={12} xs={12} className={`text-section pb-5 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
            <h1 className={`find-heading ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t('find.title')} <span className="highlight">{t('find.highlight')}</span>
            </h1>
            <p className={`fs-5 mt-4 mb-4 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t('find.description')}
            </p>
            <div className={`store-buttons ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
              <Button variant="light" className={`${i18n.language === 'ar' ? 'ms-4' : 'me-4'} rounded-pill px-4 py-2 bg-white fw-bold fs-5`}>
                <Image src={googlePlay} alt="Google Play" className="store-icon" /> {t('find.googlePlay')}
              </Button>
              <Button variant="dark" className="rounded-pill px-4 py-2 bg-dark fw-bold fs-5">
                <Image src={appStore} alt="App Store" className="store-icon" /> {t('find.appStore')}
              </Button>
            </div>
          </Col>
          <Col md={6} className="image-section text-center pb-0">
            <Image src={phoneMockup} alt="Phone Mockup" className="phone-mockup img-fluid" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Find;
