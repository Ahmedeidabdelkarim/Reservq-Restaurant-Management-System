import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tab, Tabs, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './styles/FoodTabs.css'; // Import custom styles

const FoodTabs = ({ video, ingredients, reviews }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <Container className="my-5">
            <Tabs 
                defaultActiveKey="details" 
                id="food-tabs" 
                className={`mb-3 nav-tabss-custom ${isRTL ? 'rtl' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Food Details Tab */}
                <Tab eventKey="details" title={t('food.tabs.details')}>
                    <p className={`text-${isRTL ? 'end' : 'start'} my-3`}>
                        Indulge in a mouthwatering culinary delight with our Chicken Skewers paired with vibrant slices of sweet bell peppers. Tender pieces of succulent chicken are marinated to perfection, resulting in a flavorful and juicy experience.
                    </p>
                    
                    {/* Ingredients List */}
                    <h5 dir={isRTL ? 'rtl' : 'ltr'} className={`text-${isRTL ? 'end' : 'start'}`}>{t('food.tabs.ingredients')} :</h5>
                    <ul dir={isRTL ? 'rtl' : 'ltr'} className={`text-${isRTL ? 'end' : 'start'}`}>
                        {ingredients?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    
                    {/* Preparations List */}
                    <h5 className={`text-${isRTL ? 'end' : 'start'}`}>{t('food.tabs.preparations')}:</h5>
                    <ul dir={isRTL ? 'rtl' : 'ltr'} className={`text-${isRTL ? 'end' : 'start'}`}>
                        {ingredients?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </Tab>

                {/* Video Tab */}
                <Tab eventKey="video" title={t('food.tabs.video')}>
                    <p className={`text-${isRTL ? 'end' : 'start'}`}>
                        In this vlog video, join us on a culinary journey as we create a mouthwatering dish that's perfect for any occasion - Grilled Chicken Skewers with Slices of Sweet Bell Peppers. Get ready to tantalize your taste buds as we showcase the step-by-step process of marinating tender chicken,
                    </p>
                    <div className="ratio ratio-16x9">
                        <iframe 
                            src={video} 
                            title="Recipe Video" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </Tab>

                {/* Reviews Tab */}
                <Tab eventKey="reviews" title={t('food.tabs.reviews')}>
                    {reviews?.length > 0 ? (
                        reviews.map((review, index) => (
                            <Card key={index} className="review-card p-3 mb-4">
                                <div className="review-card-top d-flex align-items-center justify-content-between">
                                    <div className="icon">
                                        {Array.from({ length: review.rating }, (_, index) => (
                                            <FaStar key={index} className="text-warning me-1" />
                                        ))}
                                    </div>
                                    <div className="text">
                                        <a href="#">{review.time}</a>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <Card.Text className={`my-2 text-${isRTL ? 'end' : 'start'}`}>
                                    {review.comment}
                                </Card.Text>

                                {/* Reviewer Info */}
                                <div className={`reviewer d-flex align-items-center mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="reviewer-img">
                                        <img 
                                            src={review.userImage} 
                                            alt="Reviewer" 
                                            className="rounded-circle" 
                                            width={50}
                                        />
                                    </div>
                                    <div className={`reviewer-info ${isRTL ? 'me-3' : 'ms-3'}`}>
                                        <h5 className="mb-1">{review.user}</h5>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center">{t('food.tabs.noReviews')}</p>
                    )}
                </Tab>
            </Tabs>
        </Container>
    );
};

export default FoodTabs;
