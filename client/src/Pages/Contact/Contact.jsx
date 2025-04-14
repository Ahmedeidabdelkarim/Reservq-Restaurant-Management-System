import ContactForm from "../../Components/ContactUs/ContactForm";
import GoogleMap from "../../Components/ContactUs/GoogleMap";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t, i18n } = useTranslation();
    return (
      <>  
        <NavBar />
        <Banner pageName={t('contact.banner.title')}/>
        <ContactForm />
        <GoogleMap />
        <Faq />
        <Find />
        <Footer />
      </>
    )
};

export default Contact;