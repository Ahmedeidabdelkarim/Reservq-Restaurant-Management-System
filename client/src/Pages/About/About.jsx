import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import AboutUs from "../../Components/AboutUs/AboutUs";
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t, i18n } = useTranslation();
    return (
      <>  
        <NavBar />
        <Banner pageName={t('about.banner.title')}/>
        <AboutUs/>
        <Faq />
        <Find />
        <Footer />
      </>
    )
};

export default About;