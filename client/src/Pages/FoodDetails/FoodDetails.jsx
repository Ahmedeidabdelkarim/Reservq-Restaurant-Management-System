import React, { useState, useEffect } from "react";
import Navbar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import RecentOrders from "../../Components/FoodDetails/RecentOrders";
import Food from "../../Components/FoodDetails/Food";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = `${process.env.REACT_APP_URL}/api/v1/product`; // Replace with your backend API base URL

const FoodDetails = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams();
  
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(t('food.error.fetch'));
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching food item:", error);
        setError(error.message);
        toast.error(t('food.error.toast'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItem();
  }, [id, t]);

  if (isLoading) {
    return <div className={`text-center py-5 ${isRTL ? 'text-end' : 'text-start'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {t('food.loading')}
    </div>;
  }

  if (error) {
    return <div className={`text-center py-5 text-danger ${isRTL ? 'text-end' : 'text-start'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {error}
    </div>;
  }

  if (!item) {
    return <div className={`text-center py-5 text-danger ${isRTL ? 'text-end' : 'text-start'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {t('food.notFound')}
    </div>;
  }

  return (
    <div>
      <Navbar />
      <Banner pageName={t('food.details')} />
      <Food food={item} />
      <RecentOrders />
      <Faq />
      <Find />
      <Footer />
    </div>
  );
};

export default FoodDetails;