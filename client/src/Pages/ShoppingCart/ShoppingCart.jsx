import React, { useState} from "react";
import { Table, Button, Image,Form, Modal } from "react-bootstrap";
import { FaTrash, FaEye,FaExclamationTriangle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ShoppingCart.css';
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import Footer from "../../Components/Footer/Footer";
import NavBar from "../../Components/NavBar/NavBar";
import FoodModal from "../../Components/FoodModal/FoodModal";
import {useNavigate} from "react-router-dom";
import { useCartContext } from "../../Contexts/CartContext";
import { useTranslation } from 'react-i18next';

const OrdersTable = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [checkedItems, setCheckedItems] = useState({});
  const {items, setItems,setCartNum} = useCartContext();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const handleCheck = (id) => {
    console.log("Checkbox clicked for item ID:", id); // Debugging
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle checkbox
    }));
  };
   
  // Toggle All Checkboxes
  const handleCheckAll = () => {
    const allChecked = Object.keys(checkedItems).length === items.length;
    const newCheckedState = allChecked
      ? {} // Uncheck all
      : items.reduce((acc, item) => ({ ...acc, [item.id]: true }), {});

    setCheckedItems(newCheckedState);
  };

  /*check items */
  const handleQuantityChange = (id, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
    setCartNum((prevNum) => prevNum - 1);
  };

  /*modal start */
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setModalShow(true);
  };

  const handleClose = () => {
    setModalShow(false);
    setSelectedItem(null);
  };
  /*modal end */

  
  const navigate = useNavigate();
  const handleCheckout = () => {
    console.log("Checked Items:", checkedItems); 
    const checkedProducts = Object.keys(checkedItems)
    .filter((id) => checkedItems[id])
    .map((id) => items.find((item) => item.id.toString() === id))
    .filter((item) => item !== undefined);

  
    console.log("Checked Products:", checkedProducts); 
  
    // Show warning if no items are selected
    if (checkedProducts.length === 0) {
      setShowWarningModal(true);
      return;
    }
  
    // Calculate total price
    const totalPrice = checkedProducts.reduce((acc, item) => {
      if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        console.error("Invalid item:", item);
        return acc; 
      }
      return acc + item.price * item.quantity;
    }, 0);
  
    console.log("Total Price:", totalPrice); 
    navigate('/checkout', { state: { checkedProducts, totalPrice } });
  };
  
  
  
  
  
  
  return (
    <>
      <NavBar />
      <Banner pageName={t('cart.title')} />

      <div className="container mt-5" dir={isRTL ? 'rtl' : 'ltr'}>
        {items.length===0?(
          <div className="text-center">
            <h2 className="mb-4">{t('cart.emptyCart')}</h2>
            <Button className="mb-5" variant="danger" onClick={() => navigate("/menu")}>
              {t('cart.continueShopping')}
            </Button>
          </div>
        ):(
          <div className="table-responsive custom-scroll">
          <Table className="text-center">
            <thead className="thead-dark">
              <tr className="rounded">
                <th>
                  <Form.Check
                   onChange={handleCheckAll}
                   checked={Object.keys(checkedItems).length === items.length}
                   type="checkbox" className="custom-checkbox"
                   />
                </th>
                <th>{t('cart.foodImage')}</th>
                <th className={`text-${isRTL ? 'end' : 'start'} ps-2`}>{t('cart.details')}</th>
                <th>{t('cart.price')}</th>
                <th>{t('cart.quantity')}</th>
                <th>{t('cart.total')}</th>
                <th>{t('cart.action')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="align-middle pt-4">
                  <td>
                    <Form.Check 
                    type="checkbox"
                    className="custom-checkbox"
                    checked={checkedItems[item.id] || false}
                    onChange={() => handleCheck(item.id)} />
                  </td>
                  <td>
                    <Image
                      src={item.images?.[0] || item.image}
                      alt={item.name}
                      rounded
                      width={100}
                    />
                  </td>
                  <td className={`text-${isRTL ? 'end' : 'start'}`}>
                    <strong>{item.name}</strong> <br />
                    <span>{t('cart.size')}: {item.size || " "}</span> <br />
                    <span>{t('cart.addons')}: {item.addon || " "}</span>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <Button
                      variant="danger"
                      className="px-2 py-1"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      −
                    </Button>{" "}
                    {item.quantity}{" "}
                    <Button
                      variant="success"
                      className="px-2 py-1"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </Button>
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <Button variant="dark" className="px-2 py-2" size="sm" onClick={() => handleViewClick(item)}>
                      <FaEye /> {t('cart.view')}
                    </Button>{" "}
                    <Button
                      variant="danger"
                      className="px-3 py-2"
                      onClick={() => handleRemove(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {selectedItem && (
            <FoodModal show={modalShow} item={selectedItem} onHide={handleClose}/>
          )}
        </div>
        )}
        
        {items.length > 0 && (
          <div className="text-center mt-3 mb-5">
            <Button variant="danger" size="lg" onClick={handleCheckout}>
              {t('cart.proceedToCheckout')}
            </Button>
          </div>
        )}

      <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} centered>
        <Modal.Header closeButton className={`d-flex justify-content-between align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Modal.Title>
            <FaExclamationTriangle className={`text-warning ${isRTL ? 'ms-2' : 'me-2'}`} /> {t('cart.warning')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <FaExclamationTriangle size={50} className="text-warning mb-3" />
          <p>{t('cart.selectItems')}</p>
        </Modal.Body>
        <Modal.Footer className={isRTL ? 'flex-row-reverse' : ''}>
          <Button variant="danger" onClick={() => setShowWarningModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      </div>

      <Find />
      <Footer />
    </>
  );
};

export default OrdersTable; 