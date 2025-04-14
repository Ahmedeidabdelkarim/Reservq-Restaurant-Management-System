import { Link } from 'react-router-dom';
import { FaFrown } from 'react-icons/fa';
import ReserqLogoBlack from '../../assets/Reserq-logo-black.svg';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';

const PaymentError = () => {
  return (
    <>
      <Container className="position-relative d-flex align-items-center justify-content-center min-vh-100">
        <div>
          <Image 
            src={ReserqLogoBlack} 
            alt="Reserq Logo" 
            className="reserq-logo position-absolute top-0 start-0" 
          />
        </div>
        <Row className="justify-content-center text-center">
          <Col md={8} lg={10}>
            <div className="error-code">
              <h1 className="display-1 fw-bold">
                <FaFrown className="error-icon" />
              </h1>
            </div>
            <h2 className="mb-4">Payment Error</h2>
            <p className="lead mb-5">
              There was an error processing your payment. Please try again later.
            </p>
            <Button 
              as={Link} 
              to="/" 
              size="lg" 
              className="rounded-pill px-5 add-btn"
            >
              Return to Homepage
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaymentError;
