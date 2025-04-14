import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Award } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
function ThankYouPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Container className="text-center py-5 mb-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2><span role="img" aria-label="party"><Award className={isRTL ? 'ms-2' : 'me-2'} color="#DC3545" size={32} /></span> {t('thankYou.title')}</h2>
      <p className="lead">{t('thankYou.confirmation')}</p>
      <Button variant="danger" onClick={() => navigate('/reservation')}>{t('thankYou.makeAnother')}</Button>
    </Container>
  );
}

export default ThankYouPage;