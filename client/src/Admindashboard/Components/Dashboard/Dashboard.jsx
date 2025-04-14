import React,{ useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card, Table } from "react-bootstrap";
import {
  FaUtensils,
  FaDollarSign,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { Chart, ArcElement } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";
Chart.register(ArcElement);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const salesData = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "Daily Sales",
      data: [1000, 1200, 1500, 2000, 2500, 3000, 3500],
      borderColor: "rgb(47,52,138)",
      backgroundColor: "rgb(162, 149, 192)",
    },
  ],
};

const ordersData = {
  labels: ["Completed", "Pending", "Canceled"],
  datasets: [
    {
      label: "Orders",
      data: [200, 50, 10],
      backgroundColor: ["#795E89", "#90365F", "#C2394D"],
    },
  ],
};

const Dashboard = () => {
  // State to store API data
  const [totalMenus, setTotalMenus] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch menus count
        const menusResponse = await fetch(`${process.env.REACT_APP_URL}/api/v1/products`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!menusResponse.ok) {
          throw new Error('Failed to fetch menus data');
        }
        const menusData = await menusResponse.json();
        
        
        // Fetch customers count
        const customersResponse = await fetch(`${process.env.REACT_APP_URL}/api/v1/customers`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers data');
        }
        const customersData = await customersResponse.json();

        
        // Fetch orders count
        const ordersResponse = await fetch(`${process.env.REACT_APP_URL}/api/v1/orders`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders data');
        }
        const ordersData = await ordersResponse.json();

        
        // Fetch total revenue
        const revenueResponse = await fetch(`${process.env.REACT_APP_URL}/api/v1/reports`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!revenueResponse.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        const revenueData = await revenueResponse.json();
        
        
        
        // Update state with fetched data
        setTotalMenus(menusData.length);
        setTotalCustomers(customersData.length);
        setTotalOrders(ordersData.length);
        setTotalRevenue(revenueData.overallStats.totalRevenue);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchDashboardData();
  }, []); // Empty dependency 


  return (
    <Row>
    <Col md={10} className="w-100 ps-4">
      <Row className="my-5">
        <Col md={6} lg={3}>
          <Card className="gradcard">
            <Card.Body>
              <Row className="flex-nowrap">
                <Col>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error loading data</p>
                  ) : (
                    <>
                      <h3>{totalMenus}</h3>
                      <p>Total Menus</p>
                    </>
                  )}
                </Col>
                <Col className="text-end">
                  <FaUtensils size={40} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="gradcard">
            <Card.Body>
              <Row className="flex-nowrap">
                <Col>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error loading data</p>
                  ) : (
                    <>
                      <h3>{totalRevenue}</h3>
                      <p>Total Revenue </p>
                    </>
                )}
                </Col>
                <Col className="text-end">
                  <FaDollarSign size={40} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="gradcard">
            <Card.Body>
              <Row className="flex-nowrap">
                <Col>
                {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error loading data</p>
                  ) : (
                    <>
                      <h3>{totalOrders}</h3>
                      <p>Total Orders</p>
                    </>
                  )}
                </Col>
                <Col className="text-end">
                  <FaClipboardList size={40} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="gradcard">
            <Card.Body>
              <Row className="flex-nowrap">
                <Col>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error loading data</p>
                  ) : (
                    <>
                      <h3>{totalCustomers}</h3>
                      <p>Total Customers</p>
                    </>
                  )}
                </Col>
                <Col className="text-end">
                  <FaUsers size={40} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h2 className="text-start">Dashboard Overview</h2>
      <Row>
        <Col md={6}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title>Total Sales & Revenue</Card.Title>
              <Line data={salesData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title>Orders Summary</Card.Title>
              <Bar data={ordersData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4 text-start">Real-Time Updates</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Table Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#001</td>
                    <td>Preparing</td>
                    <td>Occupied</td>
                  </tr>
                  <tr>
                    <td>#002</td>
                    <td>Delivered</td>
                    <td>Vacant</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  </Row>
  );
};

export default Dashboard;
