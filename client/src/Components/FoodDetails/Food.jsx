import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Image, Dropdown, Button, Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import FoodTabs from './FoodTabs';
import ImageSwiper from './ImageSwiper';
import './styles/Food.css'
import { useCartContext } from '../../Contexts/CartContext';

//Import burger images
import bur1 from '../../assets/BlogDetails/bur1.png'
import bur2 from '../../assets/BlogDetails/bur2.png'

const Food = ({food}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { addToCart } = useCartContext();
    const items = [
        { id: 1, name: t('food.items.chickenLeg'), price: 30.00, quantity: 0 },
        { id: 2, name: t('food.items.drinks'), price: 25.00, quantity: 1 },
        { id: 3, name: t('food.items.extraCheese'), price: 5.00, quantity: 0 }
    ];

    return (
        <Container className='my-5'>
            <Row>
                <Col lg={8} md={12}>
                    <h1 className={`text-${isRTL ? 'end' : 'start'}`}>{food.title}</h1>
                    <ImageSwiper itemImages={food.images}/>
                    <FoodTabs video={food.videoUrl} ingredients={food.ingredients} reviews={food.reviews}/>
                </Col>

                <Col lg={4} md={12}>
                    <Card className="p-3 my-3 together-box border-rounded">
                        <Card.Body>
                            <Card.Title className={`text-${isRTL ? 'end' : 'start'} text-dark`}>{t('food.frequentlyBought')}</Card.Title>
                            
                            {items.map(item => (
                                <div key={item.id} className={`d-flex justify-content-between align-items-center p-4 my-4 together-box-item ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Form.Check 
                                        type="checkbox"
                                        label={`${item.name} ($${item.price.toFixed(2)})`}
                                        className={`flex-grow-1 ${isRTL ? 'form-check-reverse' : ''}`}
                                        style={isRTL ? { 
                                            paddingRight: '1.5em',
                                            paddingLeft: '0',
                                            marginRight: '0',
                                            marginLeft: '1em'
                                        } : {}}
                                    />
                                    <div className={`d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <Button size="sm" className='minus-btn'><i className={`fa-solid fa-minus ${isRTL ? 'ms-2' : 'me-2'}`}></i></Button>
                                        <div className="px-3">{item.quantity}</div>
                                        <Button size="sm" className='plus-btn'><i className={`fa-solid fa-add ${isRTL ? 'me-2' : 'ms-2'}`}></i></Button>
                                    </div>
                                </div>
                            ))}

                            {/* Variation and Add to Cart */}
                            <div className={`d-flex justify-content-between align-items-center mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={`d-flex align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Button size="sm" className='minus-btn'><i className={`fa-solid fa-minus ${isRTL ? 'ms-2' : 'me-2'}`}></i></Button>
                                    <div className="px-3">2</div>
                                    <Button size="sm" className='plus-btn'><i className={`fa-solid fa-add ${isRTL ? 'me-2' : 'ms-2'}`}></i></Button>
                                </div>
                                <Dropdown>
                                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                        {t('food.variationSize')}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={isRTL ? 'text-end' : 'text-start'}>
                                        <Dropdown.Item href="#">10</Dropdown.Item>
                                        <Dropdown.Item href="#">20</Dropdown.Item>
                                        <Dropdown.Item href="#">30</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            
                            <Button size="lg" className='add-btn w-100 my-3' onClick={() => addToCart(food)}>
                                <i className={`fa-solid fa-cart-plus ${isRTL ? 'ms-2' : 'me-2'}`}></i> {t('food.addToCart')}
                            </Button>
                        </Card.Body>
                    </Card>
                    <div className="burger-imgs">
                        <div className="w-100 h-100 overflow-hidden">
                            <Image className="mb-4" src={bur1} alt="" fluid/>
                        </div>
                        <div className="w-100 h-100 overflow-hidden">
                            <Image src={bur2} alt="" fluid/>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Food;
