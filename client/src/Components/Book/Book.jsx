import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "reactstrap";
import "./style/book.css";
import Table from "./Table";

const Reservation = ({ setPage }) => {
  const [totalTables, setTotalTables] = useState([]);
  const [selection, setSelection] = useState({
    table: { name: null, id: null },
    date: new Date(),
    time: null,
    location: "Any Location",
    size: 0,
  });
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [reservationError, setReservationError] = useState(false);

  const locations = ["Any Location", "Patio", "Inside", "Bar"];
  const times = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

  const getDateTime = () => {
    const dateStr = selection.date.toDateString();
    let timeStr = selection.time;

    if (!timeStr) return null;

    let hour = parseInt(timeStr);
    if (timeStr.includes("PM") && hour !== 12) hour += 12;
    if (timeStr.includes("AM") && hour === 12) hour = 0;

    return new Date(`${dateStr} ${hour}:00`);
  };

  const getEmptyTablesCount = () =>
    totalTables.filter((table) => table.isAvailable).length;

  useEffect(() => {
    if (selection.time && selection.date) {
      const fetchAvailability = async () => {
        const datetime = getDateTime();
        if (!datetime) return;

        try {
          const res = await fetch("http://localhost:3005/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: datetime }),
          });
          const data = await res.json();
          const availableTables = data.tables.filter((table) =>
            (selection.size > 0 ? table.capacity >= selection.size : true) &&
            (selection.location !== "Any Location" ? table.location === selection.location : true)
          );
          setTotalTables(availableTables);
        } catch (err) {
          console.error("Error fetching availability", err);
        }
      };

      fetchAvailability();
    }
  }, [selection]);

  const reserve = async () => {
    if (!booking.name || !booking.phone || !booking.email) {
      setReservationError(true);
      return;
    }

    const datetime = getDateTime();
    if (!datetime) return;

    try {
      const res = await fetch("http://localhost:3005/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          date: datetime,
          table: selection.table.id,
        }),
      });

      const responseText = await res.text();
      console.log("Reserved:", responseText);
      setPage(2);
    } catch (err) {
      console.error("Error making reservation", err);
    }
  };

  const selectTable = (name, id) => {
    setSelection((prev) => ({ ...prev, table: { name, id } }));
  };

  const handleDropdownSelect = (key, value) => {
    setSelection((prev) => ({ ...prev, [key]: value, table: { ...prev.table } }));
  };

  const renderDropdownItems = (items, key) =>
    items.map((item) => (
      <DropdownItem
        key={item}
        onClick={() => handleDropdownSelect(key, item)}
        className="booking-dropdown-item"
      >
        {item}
      </DropdownItem>
    ));

  const renderTables = () =>
    totalTables.map((table) => (
      <Table
        key={table._id}
        id={table._id}
        chairs={table.capacity}
        name={table.name}
        empty={table.isAvailable}
        selectTable={selectTable}
      />
    ));

  return (
    <div className="reservation-wrapper">
      <Row noGutters className="text-center align-items-center pizza-cta">
        <Col>
          <p className="looking-for-pizza">
            {selection.table.id ? "Confirm Your Reservation" : "Indulge in a Delicious Table"}
            <i className={`fas ${selection.table.id ? "fa-clipboard-check" : "fa-concierge-bell"} pizza-slice`} />
          </p>
          {selection.table.id && (
            <p className="selected-table">You are booking table {selection.table.name}</p>
          )}
          {reservationError && (
            <p className="reservation-error">* Please fill out all of the details.</p>
          )}
        </Col>
      </Row>

      {!selection.table.id ? (
        <>
          <Row noGutters className="text-center align-items-center booking-form">
            <Col xs="12" sm="3" className="mb-3 mb-sm-0">
              <input
                type="date"
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelection((prev) => ({ ...prev, date: isNaN(date) ? new Date() : date }));
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="mb-3 mb-sm-0">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time || "Select a Time"}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {renderDropdownItems(times, "time")}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3" className="mb-3 mb-sm-0">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.location}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {renderDropdownItems(locations, "location")}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3" className="mb-3 mb-sm-0">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.size || "Select a Party Size"}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {renderDropdownItems([1, 2, 3, 4, 5, 6, 7], "size")}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>

          <Row noGutters className="tables-display">
            <Col>
              {getEmptyTablesCount() > 0 && (
                <p className="available-tables">{getEmptyTablesCount()} available</p>
              )}

              {selection.date && selection.time ? (
                getEmptyTablesCount() > 0 ? (
                  <>
                    <div className="table-key">
                      <span className="empty-table"></span> Available
                      <span className="full-table"></span> Unavailable
                    </div>
                    <Row noGutters className="justify-content-center">
                      {renderTables()}
                    </Row>
                  </>
                ) : (
                  <p className="table-display-message">No Available Tables</p>
                )
              ) : (
                <p className="table-display-message">
                  Please select a date and time for your reservation.
                </p>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row
            noGutters
            className="text-center justify-content-center reservation-details-container"
          >
            {["name", "phone", "email"].map((field) => (
              <Col xs="12" sm="3" key={field} className="reservation-details">
                <Input
                  type="text"
                  bsSize="lg"
                  placeholder={
                    field === "phone"
                      ? "Phone Number"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  className="reservation-input"
                  value={booking[field]}
                  onChange={(e) =>
                    setBooking((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              </Col>
            ))}
          </Row>
          <Row noGutters className="text-center">
            <Col>
              <Button color="none" className="book-table-btn" onClick={reserve}>
                Book Now
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Reservation;