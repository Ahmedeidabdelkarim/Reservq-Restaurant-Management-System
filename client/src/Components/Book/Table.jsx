import React from "react";
import { Row, Col } from "reactstrap";

const Table = ({ id, name, chairs, empty, selectTable }) => {
  const renderChairsRow = (count, rowIndex) =>
    Array.from({ length: count }, (_, i) => (
      <span
        key={`${rowIndex}-${i}`}
        className={empty ? "empty-table" : "full-table"}
      />
    ));

  const handleClick = () => {
    if (empty) {
      selectTable(name, id);
    } else {
      console.log("Tried to select a full table");
    }
  };

  return (
    <div className="table-container">
      <Col
        className={`table ${empty ? "selectable-table" : ""}`}
        onClick={handleClick}
      >
        <Row noGutters className="table-row">
          <Col className="text-center">
            {renderChairsRow(Math.ceil(chairs / 2), "top")}
          </Col>
        </Row>
        <Row noGutters className="table-row">
          <Col className="text-center">
            {renderChairsRow(Math.floor(chairs / 2), "bottom")}
          </Col>
        </Row>
        <p className="text-center table-name">{name}</p>
      </Col>
    </div>
  );
};

export default Table;
