import React from "react";
import { Row, Col, Button } from "reactstrap";
import cafeImage from "../../../public/cafe.jpg"; // Better static asset handling

const Main = ({ setPage }) => {
  return (
    <div>
      <Row noGutters className="text-center align-items-center pizza-cta">
        <Col>
          <p className="looking-for-pizza">
            If you're looking for great pizza
            <i className="fas fa-pizza-slice pizza-slice" />
          </p>
          <Button
            color="none"
            className="book-table-btn"
            onClick={() => setPage(1)}
          >
            Book a Table
          </Button>
        </Col>
      </Row>

      <Row noGutters className="text-center big-img-container">
        <Col>
          <img
            src={cafeImage}
            alt="A cozy café with warm lighting and tables"
            className="big-img"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Main;
