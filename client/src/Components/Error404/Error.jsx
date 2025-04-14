import { Link } from 'react-router-dom';
import { FaFrown } from 'react-icons/fa';
import ReserqLogoBlack from '../../assets/Reserq-logo-black.svg';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t, i18n } = useTranslation('error404');

  return (
    <>
      <Container 
        className="position-relative d-flex align-items-center justify-content-center min-vh-100"
        
      >
        <div>
          <Image 
            src={ReserqLogoBlack} 
            alt="Reserq Logo" 
            className={`reserq-logo position-absolute top-0 start-0`} 
          />
        </div>
        <Row className="justify-content-center text-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <Col md={8} lg={6}>
            <div className="error-code">
              <h1 className="display-1 fw-bold">4<FaFrown className="error-icon" />4</h1>
            </div>
            <h2 className="mb-4">{t('error404.title')}</h2>
            <p className="lead mb-5">
              {t('error404.description')}
            </p>
            <Button 
              as={Link} 
              to="/" 
              size="lg" 
              className="rounded-pill px-5 add-btn"
            >
              {t('error404.returnHome')}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NotFound;