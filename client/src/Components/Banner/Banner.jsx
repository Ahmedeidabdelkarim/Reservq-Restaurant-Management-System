import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col  } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";


const Banner = ({pageName}) => {
  return (
    <div className="contact-page text-center text-white py-5page1" style={styles.background} >
      <Container  >
        

        {/* عنوان الصفحة */}
        <Row className="justify-content-center pt-5">
          <Col md={8}>
            <h1 className="fw-bold">{pageName}</h1>
          </Col>
        </Row>
        
       <div className="subtitle fs-4">
        <a className="text-decoration-none text-white me-2" href="/">Home</a>
        <span><FontAwesomeIcon icon={faChevronRight} className="me-2 fs-6"/>{pageName}</span>
       </div>
       
      </Container>
    </div>
  );
};

// أنماط مخصصة
const styles = {
  background: {
    backgroundColor: "rgb(0,9,41)",
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  }
};

export default Banner;
