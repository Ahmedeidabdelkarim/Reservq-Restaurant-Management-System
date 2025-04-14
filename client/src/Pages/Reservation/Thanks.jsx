import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import ThankYouPage from "../../Components/resrevation/Thankyoupage";
import { useTranslation } from'react-i18next';
const Thanks = () => {
    const { t} = useTranslation();
    return (
      <>  
        <NavBar />
        <Banner pageName={t('reservation.title')}/>
        <ThankYouPage/>
        <Faq />
        <Find />
        <Footer />
      </>
    )
};

export default Thanks;