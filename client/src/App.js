import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contact from './Pages/Contact/Contact';
import Reservation from './Pages/Reservation/Reservation';
import Thanks from './Pages/Reservation/Thanks';
import About from './Pages/About/About';
import ShoppingCart from './Pages/ShoppingCart/ShoppingCart';
import BlogDetails from './Pages/BlogDetails/BlogDetails';
import Blog from './Pages/Blog/Blog';
import CustomSignUp from './Pages/SignUp/CustomSignUp';
import CustomLogin from './Pages/Login/CustomLogin';
import FoodDetails from './Pages/FoodDetails/FoodDetails';
import CutomMenu from './Pages/Menu/CutomMenu';
import Checkout from './Pages/Checkout/Checkout';
import Error from './Pages/Error/Error404';
import EmailSent from './Pages/Login/EmailSentSuccess';

// toast loader
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from './Pages/Login/ForgotPassword';
import Dashboard from './Pages/UserDashboard/Dashboard';
import AdminDashboard from './Admindashboard/AdminDashboard';
import ProtectedRoute from './Admindashboard/ProtectedRoute';
import ResetPassword from './Pages/Login/ResetPassword';

import PaymentSuccess from './Components/Checkout/PaymentSuccess';
import PaymentError from './Components/Checkout/PaymentError';
import PaymentCapture from './Components/Checkout/PaymentCapture';
import Confirmation from './Pages/Reservation/Confirmation';
function App() {
  return (
    <>
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path='/about' element={<About />} />
        <Route path='/cart' element={<ShoppingCart />} />
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/blog/:id' element={<BlogDetails/>}/>
        <Route path='/item/:id' element={<FoodDetails/>} />
        <Route path='/signup' element={<CustomSignUp/>} />
        <Route path='/login' element={<CustomLogin />} />
        <Route path='/menu' element={<CutomMenu/>} />
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path="/forget-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/email-sent' element={<EmailSent/>} />
        <Route path='/payment-capture' element={<PaymentCapture/>} />
        <Route path='/payment-success' element={<PaymentSuccess/>} />
        <Route path='/payment-cancel' element={<PaymentError/>} />
        <Route path='/*' element={<Error/>} />
        {/* Admin Routes (Protected) */}
        <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>

    <ToastContainer position="top-right" autoClose={2000} />
    </div>
    </>
  );
}

export default App;
