import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from 'react-i18next';

const EmailSent = () => {
  const { t, i18n } = useTranslation();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className={`p-4 shadow-lg rounded text-center ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`} style={{ maxWidth: "400px" }}>
        <AiOutlineMail size={50} className="text-success align-self-center mb-3" />
        <h3 className="mb-3 text-success">{t('emailSent.title')}</h3>
        <p className="text-muted">
          {t('emailSent.message')}
        </p>
        <Link to="/login">
          <Button className="w-100 py-2 mt-3 add-btn">
            {t('emailSent.backToLogin')}
          </Button>
        </Link>
      </Card>
    </Container>
  );
};

export default EmailSent;
