import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import ReservationForm from '../../Components/resrevation/Reservationform';
import { useTranslation } from 'react-i18next';

const Reservation = () => {
    const { t, i18n } = useTranslation();

    return (
      <>  
        <NavBar />
        <Banner pageName={t('reservation.title')} />
        <ReservationForm />
        <Faq />
        <Find />
        <Footer />
      </>
    );
};

export default Reservation;