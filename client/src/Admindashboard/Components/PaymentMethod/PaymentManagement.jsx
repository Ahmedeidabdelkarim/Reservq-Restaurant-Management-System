import React, { useState } from "react";
import { Container,Table,Badge } from "react-bootstrap";
import {FaCreditCard, FaFileInvoiceDollar, FaMoneyBillWave, FaPaypal, FaStripe } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import './PaymentManagement.css'

const getPaymentIcon = (method) => {
  switch (method) {
    case "Card": return <FaCreditCard className="text-primary" />;
    case "Cash": return <FaMoneyBillWave className="text-success" />;
    case "PayPal": return <FaPaypal className="text-info" />;
    case "Stripe": return <FaStripe className="text-warning" />;
    default: return <FaFileInvoiceDollar />;
  }
};

const PaymentManagement = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, customer: "John Doe", amount: 50, method: "Card", status: "Completed" },
    { id: 2, customer: "Jane Smith", amount: 30, method: "Cash", status: "Pending" },
    { id: 3, customer: "Alice Johnson", amount: 75, method: "PayPal", status: "Refunded" },
    { id: 4, customer: "Bob Williams", amount: 100, method: "Stripe", status: "Completed" },
    { id: 1, customer: "John Doe", amount: 50, method: "Card", status: "Completed" },
    { id: 2, customer: "Jane Smith", amount: 30, method: "Cash", status: "Pending" },
    { id: 3, customer: "Alice Johnson", amount: 75, method: "PayPal", status: "Refunded" },
    { id: 4, customer: "Bob Williams", amount: 100, method: "Stripe", status: "Completed" }
  ]);

  return (
    <Container>
      <div className="payment">
      <h2 className="animate__animated animate__fadeInDown text-start py-3">Payments & Transactions</h2>
      <Table striped bordered hover responsive className="mt-3 animate__animated animate__fadeInUp">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id}>
              <td>{index + 1}</td>
              <td>{transaction.customer}</td>
              <td>${transaction.amount}</td>
              <td>{getPaymentIcon(transaction.method)} {transaction.method}</td>
              <td>
                <Badge bg={transaction.status === "Completed" ? "success" : transaction.status === "Pending" ? "warning" : "danger"}>
                  {transaction.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </Container>
  );
};

export default PaymentManagement;