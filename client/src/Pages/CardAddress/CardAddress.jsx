import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import Checkout from "../../Components/Checkout/Checkout";
import { useTranslation } from 'react-i18next';

const CardAddresses = () => {
    const { t} = useTranslation();
    
    return (
      <>  
        <NavBar />
        <Banner pageName={t('cardAddress.title')}/>
        <Checkout/>
        <Find />
        <Footer />
      </>
    )
};

export default CardAddresses;