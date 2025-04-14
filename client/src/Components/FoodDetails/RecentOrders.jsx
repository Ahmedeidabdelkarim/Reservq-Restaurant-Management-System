import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import food1 from '../../../src/assets/foods/food1.png'
import food2 from '../../../src/assets/foods/food2.png'
import food3 from '../../../src/assets/foods/food3.png'
import items from "../../data/foods.json";
import { useCartContext } from '../../Contexts/CartContext';

const RecentOrders = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { addToCart } = useCartContext();

    const orders = [
        {
            name: "Eggplant Parmesan & Linguine",
            price: "$30",
            rating: "4.7(2.5K)",
            img: food1,
        },
        {
            name: "Quinoa-Stuffed Bell Pepper",
            price: "$30",
            rating: "4.7(2.5K)",
            img: food2,
        },
        {
            name: "BBQ Pulled Pork Sandwich",
            price: "$30",
            rating: "4.7(2.5K)",
            img: food3,
        },
    ]

    return (
        <Container className='my-5 pb-5' dir={isRTL ? 'rtl' : 'ltr'}>
            <Row>
                <h2 className={`text-${isRTL ? 'end' : 'start'} my-5`}>{t('food.recentOrders')}</h2>
            </Row>
            <Row>
                {items.slice(0, 3).map((item) => (
                    <Col key={item.id} md={4}>
                        <Card className="shadow-lg photomenu">
                            <Link to={`/item/${item.id}`}>
                                <div className="position-relative overflow-hidden">
                                    <Card.Img variant="top" src={item.images[0]} className="imgmenu" />
                                    <Badge bg="dark" className={`position-absolute top-0 ${isRTL ? 'start-0' : 'end-0'} m-2`}>
                                        {item.discount}% {t('food.off')}
                                    </Badge>
                                    <FaHeart className={`position-absolute top-0 ${isRTL ? 'end-0' : 'start-0'} m-2 text-danger fs-4`} />
                                </div>
                            </Link>
                            <Card.Body>
                                <div className={`d-flex align-items-center mb-2 justify-content-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div>
                                        <h5 className="text-danger fw-bold">${item.price}</h5>
                                    </div>
                                    <div className={`d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <FaStar className={`text-warning ${isRTL ? 'ms-1' : 'me-1'}`} />
                                        <span className="fw-bold">{item.rating}</span>
                                        <span className={`text-muted ${isRTL ? 'me-1' : 'ms-1'}`}>({item.reviews.length})</span>
                                    </div>
                                </div>
                                <Card.Title className={`text-${isRTL ? 'end' : 'start'} my-3`}>{item.name}</Card.Title>

                                <ul className={`list-unstyled mb-3 text-${isRTL ? 'end' : 'start'}`}>
                                    <li className={`mb-2 d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <span className={isRTL ? 'ms-2' : 'me-2'}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 12L10.5347 14.2812C10.9662 14.6696 11.6366 14.6101 11.993 14.1519L16 9M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FE724C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                        {t('food.items.chickenLeg')}
                                    </li>
                                    <li  className={`d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <span className={isRTL ? 'ms-2' : 'me-2'}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 12L10.5347 14.2812C10.9662 14.6696 11.6366 14.6101 11.993 14.1519L16 9M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FE724C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                        {t('food.items.spicySauce')}
                                    </li>
                                </ul>
                                <Button className="add-btn w-100" onClick={() => addToCart(item)}>
                                    <FaShoppingCart className={isRTL ? 'ms-2' : 'me-2'} /> {t('food.addToCart')}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default RecentOrders;