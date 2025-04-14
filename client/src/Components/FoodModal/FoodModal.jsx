import React, { useState, useEffect } from "react";
import { Modal, Button, Image, Form } from "react-bootstrap";
import { useCartContext } from "../../Contexts/CartContext";
import { useTranslation } from 'react-i18next';

const FoodModal = ({ show, onHide, item}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const {items, setItems} = useCartContext();
  const [selectedAddons, setSelectedAddons] = useState({});
  const [size, setSize] = useState("Small");

  const addons = [
    { name: "Chicken Leg", price: 30 },
    { name: "Drinks", price: 25 },
    { name: "Nan", price: 10 },
    { name: "Extra Cheese", price: 5 },
  ];

  const sizePrices = {
    Small: 0,
    Medium: 5,
    Large: 10,
  };

  useEffect(() => {
    if (item) {
      setSize(item.size || "Small");
      // Initialize selected add-ons based on the item's existing add-ons
      setSelectedAddons(
        item.addons
          ? item.addons.reduce((acc, addon) => ({ ...acc, [addon.name]: true }), {})
          : {}
      );
    }
  }, [item]);

  const handleAddonChange = (addon) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addon]: !prev[addon],
    }));
  };

  const totalPrice = () => {
    const addonTotal = Object.keys(selectedAddons).reduce(
      (sum, key) => (selectedAddons[key] ? sum + addons.find((a) => a.name === key).price : sum),
      0
    );
    return (item ? item.price : 0) + addonTotal + sizePrices[size];
  };

  const handleUpdateToCart = () => {
    if (item) {
      const existingItem = items.find((cartItem) => cartItem.id === item.id);

      // Calculate the total price with size and add-ons
      const updatedPrice = item.price + sizePrices[size] + Object.keys(selectedAddons).reduce(
        (sum, key) => (selectedAddons[key] ? sum + addons.find((a) => a.name === key).price : sum),
        0
      );

      // Merge existing add-ons with newly selected add-ons
      const updatedAddons = [
        ...new Set([
          ...(existingItem?.addon || []),
          ...Object.keys(selectedAddons).filter((key) => selectedAddons[key]),
        ]),
      ];

      const updatedItem = {
        ...item,
        size,
        price: updatedPrice, 
        addon: updatedAddons,
      };

      // Update the cart
      const updatedItems = items.map((cartItem) =>
        cartItem.id === item.id ? updatedItem : cartItem
      );

      setItems(updatedItems);
      onHide();
    }
  };


  
  

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={`d-flex justify-content-between align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }} className={isRTL ? 'text-end' : 'text-start'}>
        <Image className="w-100" src={item.images[0]} alt={item.name} fluid rounded />
        <div className={`title d-flex justify-content-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h5 className="mt-3">{item.name}</h5>
            <h4 className="mt-3 text-danger">${item.price}</h4>
        </div>
        <h5 className="mt-2">{t('foodModal.selectAddons')}</h5>
        {addons.map((addon) => (
          <Form.Check
            key={addon.name}
            type="checkbox"
            label={`${addon.name} ($${addon.price})`}
            onChange={() => handleAddonChange(addon.name)}
            checked={selectedAddons[addon.name] || false}
            className={isRTL ? 'text-end' : 'text-start'}
          />
        ))}
        <div className={`mt-3 d-flex justify-content-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h4 className="mt-3">{t('foodModal.total')}: ${totalPrice().toFixed(2)}</h4>
          <Form.Select 
            className={`w-50 text-white ${isRTL ? 'text-end' : 'text-start'}`}
            style={{backgroundColor: "rgb(11, 11, 37)"}} 
            value={size} 
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="Small">{t('foodModal.size.small')}</option>
            <option value="Medium">{t('foodModal.size.medium')}</option>
            <option value="Large">{t('foodModal.size.large')}</option>
          </Form.Select>
        </div>
        
      </Modal.Body>
      <Modal.Footer className={isRTL ? 'flex-row-reverse' : ''}>
        <Button className="w-100 py-3" variant="danger" onClick={handleUpdateToCart}>
          {t('foodModal.update')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FoodModal;
