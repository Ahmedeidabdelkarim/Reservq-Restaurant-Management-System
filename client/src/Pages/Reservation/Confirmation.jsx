import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import ConfirmationPage from "../../Components/resrevation/Confirmationpage";
import { useTranslation } from'react-i18next';
const Confirmation = () => {
    const { t} = useTranslation();
    return (
      <>  
        <NavBar />
        <Banner pageName={t('reservation.title')}/>
        <ConfirmationPage/>
        <Faq />
        <Find />
        <Footer />
      </>
    )
};

export default Confirmation;