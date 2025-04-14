import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
const PaymentCapture = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('token');
  const orderId = searchParams.get('orderId');
  const apiUrl = `${process.env.REACT_APP_URL}/api/v1`;
  useEffect(() => {
    const capturePayment = async () => {
      if (!paymentIntentId || !orderId) {
        navigate('/payment-cancel', { replace: true });
        return;
      }
      try {
          const apiResponse = await fetch(`${apiUrl}/order/capture`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              paymentId: paymentIntentId,
              orderId: orderId
            })
          })
          if (apiResponse.ok) {
            // Redirect to the payment success page if the API call is successful.
            navigate('/payment-success', { replace: true });
          }
          else {
            // Redirect to the payment error page if the API call fails.
            navigate('/payment-cancel', { replace: true });
          }
      } catch (error) {
        // You can handle API errors here if needed.
        console.error('Error capturing payment:', error);
        //navigate('/payment-error', { replace: true });
      }
    };

    capturePayment();
  }, [paymentIntentId, navigate]);

  return (
    <Container className="position-relative d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <Spinner animation="border" role="status" className="mb-4">
            <span className="visually-hidden">Processing...</span>
          </Spinner>
          <h2 className="mb-4">Processing Payment Capture...</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCapture;
