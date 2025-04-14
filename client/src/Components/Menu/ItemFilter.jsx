import React, { useState } from 'react';
import { Container, Row, Col, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ItemFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Container className="my-4 py-3" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dropdowns and Search Form Row */}
      <Row className="mb-3 gx-1">
        {/* Dropdown for All Category */}
        <Col xs={6} md={6} lg={2}>
          <Dropdown>
            <Dropdown.Toggle style={{padding: '11px'}} variant="light" className={`w-100 text-${isRTL ? 'end' : 'start'}`}>
              {t('menu.filter.categories')}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#">{t('menu.filter.fastFood')}</Dropdown.Item>
              <Dropdown.Item href="#">{t('menu.filter.desserts')}</Dropdown.Item>
              <Dropdown.Item href="#">{t('menu.filter.beverages')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Dropdown for Star Rating */}
        <Col xs={6} md={6} lg={2}>
          <Dropdown>
            <Dropdown.Toggle style={{padding: '11px'}} variant="light" className={`w-100 text-${isRTL ? 'end' : 'start'}`}>
              ⭐ {t('menu.filter.rating')}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#">1 {t('menu.filter.star')}</Dropdown.Item>
              <Dropdown.Item href="#">2 {t('menu.filter.stars')}</Dropdown.Item>
              <Dropdown.Item href="#">3 {t('menu.filter.stars')}</Dropdown.Item>
              <Dropdown.Item href="#">4 {t('menu.filter.stars')}</Dropdown.Item>
              <Dropdown.Item href="#">5 {t('menu.filter.stars')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Dropdown for Price Range */}
        <Col xs={6} md={6} lg={2}>
          <Dropdown>
            <Dropdown.Toggle style={{padding: '11px'}} variant="light" className={`w-100 text-${isRTL ? 'end' : 'start'}`}>
              💰 {t('menu.filter.price')}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#">$</Dropdown.Item>
              <Dropdown.Item href="#">$$</Dropdown.Item>
              <Dropdown.Item href="#">$$$</Dropdown.Item>
              <Dropdown.Item href="#">$$$$</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Dropdown for Meal Type */}
        <Col xs={6} md={6} lg={2}>
          <Dropdown>
            <Dropdown.Toggle variant="light" style={{padding: '11px'}} className={`w-100 text-${isRTL ? 'end' : 'start'}`}>
              🍽️ {t('menu.filter.mealType')}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#">{t('menu.filter.breakfast')}</Dropdown.Item>
              <Dropdown.Item href="#">{t('menu.filter.lunch')}</Dropdown.Item>
              <Dropdown.Item href="#">{t('menu.filter.dinner')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Search Form */}
        <Col xs={12} md={12} lg={4}>
          <Form className="d-flex">
            <FormControl
              type="text"
              placeholder={t('menu.search.placeholder')}
              className={isRTL ? "ms-2" : "me-2"}
              value={searchTerm}
              onChange={handleInputChange}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <Button variant="danger">
              <FaSearch />
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemFilter;
