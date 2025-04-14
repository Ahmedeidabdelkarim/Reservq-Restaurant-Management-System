import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AboutUs.css";
import about from "../../assets/About/about.png";
import anim from "../../assets/About/Button-anim.png"
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
    const { t, i18n } = useTranslation();
    
    return (
        <Container className="py-5">  
            <Row className="align-items-center">
                <Col md={12} lg={6} className="position-relative py-3">
                    <div>
                        <img src={about} alt="" className="w-100"/>
                    </div>
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <img src={anim} alt="" className="Button-anim" />
                    </div>
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <h2 className="h2 text-white m-0">50</h2>
                        <span className="span">{t('about.stats.years')}</span>
                    </div>
                </Col>
                
                <Col md={12} lg={6} className="">
                    <div className="p-lg-3">
                        <h2 className={`h1 fw-bold ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                            {t('about.story.title')}
                        </h2>
                        <p className={`h4 pt-3 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                            {t('about.story.description1')}
                        </p>
                        <p className={`h4 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                            {t('about.story.description2')}
                        </p>
                        <Row className="pt-3">
                            <Col md={6} lg={6} className={i18n.language === 'ar' ? 'text-md-end' : 'text-md-start'}>
                                <img src="data:image/png;base64,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" alt="icon"></img>
                                <div className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                                    <h3 className="fw-bold pt-3">
                                        {t('about.stats.customers.title')}
                                    </h3>
                                    <p className="h4">
                                        {t('about.stats.customers.description')}
                                    </p>
                                </div>
                            </Col>
                            
                            <Col md={6} lg={6} className={`${i18n.language === 'ar' ? 'text-md-end' : 'text-md-start'} pt-lg-0 pt-3`}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA7CAYAAADFJfKzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAArKSURBVHgB1VtbbBTXGf7ntuvFNFlAAiQu3XCplIAvqIGAHSk2IlDyAi4PTQsFo7YkihQgJKA+hNgOfWhApRCktIFKXBTU9CFgXkJIo9qRwiVGLTZ2mgdu24RIOCpoU3zd2ZnT//vt2aztNbZnFrA/aXZmZ87MnO/857+c/5zR6D6h8/ylmGVYZZqmFymimKaoWGlulEiLfl9KJTTS4oo03lOjUm6Ty/vQovmNdB+gUQ5hX2wu08lYpcitVK13os7lq+TcuEnq1h1yr39Dqr1TtvTL8yOkTZkoe332NDIK5pIxazppUyfGuWL1rnKPWgsL6ilHCExWXboUdVN5WxQ5W5lcNHXhMjnnmsn99g75hc4NYBTMIWtVGelzpsfJVTW2Y9dHliyIUwD4JptJMvX3hqj9yefkNF+lXEOfNY2s1WVkPftUXFP6EWPh4zXkE77ISndV+uFU85VY997jgaQ4XEDa1tqVQhqSNhfNP0IjxIjI9kgzXOW23t7atfe9+yLJoWAuLqDwC2uY/KR9utldoy1YkBjuvcMmC+saMkJ1yVP1seTx030MzYMGDFoIUq4oi9t2sny4ujwsssmGlmJdo7rugyejdm09jRZYq56h8Itr4q6rKobjroYkC6Jae2dd166/RB9Gtx0K0q23rUuo/LzyoQjfk6xHtPO3B6Lwk6MVsNiR328ekrA+2AXoqEHaSba2o5oogPp17ToU1TWtDvUerFxWsrC6MEZdh07EUheaaSwAKtb97gdRywrVof7ZymQlC/cCqzuajNFwYJ/6lOyT9THUP9v1AWRTDS2V8KNwL2MRqDfqj8Cn/7UBZHkUUsXd4aH60SBAvRHw8GjrcP/u3Iesc/HLKo5xx4yeDgbor9N0JZZKmlszz6fJihVTbuVY7b790f3H46Tp+pZM6ZreAQbakKqfoN4oLaK819aTPnOq/E+dbaKu198h9b+2dBl9xhSKvL2DtEfHy4Yy3XuOkvt1a7qM9kg+hTjuDT2/Qv67X9+i7t3HKHWuiUYKt/UOMZ+oWroQ0q2W53sXnYYvbrS//FZspD4VRMcxiY71b5DGZN2Wq2StLCXzuVJqX/1qmui4o2/2NADeyKkLnQmHt/+Sy7yWbpTx//gz2e9/TDaT02f0PCu/di91vrzbF2GMiSNvbU6YC+dNkHrgB5bLufFNzE/wkLd9PVd4G407VkNWSSHv3wQXUl/dIrOkSMpAWkk2emiA0M+WU/j55WRygyQPnuBrP5UyuOa0XCPiRojseolCK0uY6B+oY8MbFN6xnvxAdPfylahnmYUsW64Ndm0d+QGkBomiW3bu/JNIM8wEkh+dE6kDxvzZ5HxxTfadm/dQB29GwWwhZ3pl5s0WqVpMGgRRxj59TiSMzS/E2Cpt9fdkXSpDvsgXIMbv2kRftUfGk86EoIc6618aiXZSKDN9ijQONpVo6/sYvq7NnCJ7Y/4c0V/0DIe7MilFfuGcv8zC1Dbg2Ew2XCpmoxTzm22wWYI6S8VhyaLbobLQMRx7Omt/9Jl05Y7KKtFdlOna+Q6FN60h+69npIzLkg+zSuDeyIEdIk3p+ix5P/rqAYYKyT/1r3//0NTJKk5dv0l+0b3nGOWf7NGtLj4GUGl0Sc/SJvk4v3YFOdwobUtfkHOhTayrj+ZT8m8fy3+ogVnSJI3S37Dh2UHA6SNSkyeU64pUcZBxqkhy826uVI10Y5CAbnrEPXRsqJJ0CnQTJOBeYJ0zgXvkGj8jk2ime/IDGF52AsWmphlF7jX/kgVgaJLvnpCuCx/aVr5pQBk0CiqORoHHG4wEDBh6CtyX/f6ZwETl3Zy3ZiMVMzVyo0HjYFhd+M/U6bPcZc+w32zPWg4VR6N4x1kr1tsoIOuy/xXS/NwgcDlRrxtUpGNqghWYgsDodQ/iJ+8BWFj3brs0BrrpPSsIiw6X82g+BYVq64RBj5qYewkiWXRbMTYMnf1rN0uuf/cTN/Lc0+J/nc+aWGLtYsRg3OBasoeMy1nKcFl3KfXhuT6h50jRyy+qU0CgcqgwrKxYUe6GiKK8BgDw3+KISAwhS0qfMVnusZhQ3u9eSpdDA8Ao4Rkd66vo7o/Xcrnr3KDBpQuYlCOAjEiCJeByqIgwElYZQJftYMtrIEhgf8ozeqLnKQ4XYYwib2/vqUxpkagCNtgAPDOXMGXaMD8S2EhJBVkiiGPRPRH3ekBALmU4OEAZlzc0ihxzF7Z7fa2394ILBxVc+TQFBZLqjISuKS3R+ycQzNJiCfMASNb6SUmPgVG9oSB0mwcBCCtRzmI/i2NPF1EWgwPcK//5Gp6ZC8i0KM8D69xdGjE36vtBveNThyuJCBaBhYZQj4P4Pud4wzmEuThnf3hWyuFenEPZbOe8mDsQ2fHj+J1uQrMbmvclD9Vu8ZtJxBj0Xi4H0oExgnQHXCsZXtwL3W9b+iL5BaY8Q7+p2M9BhdZoPDaNbPIH+EwECjA8AIyR1Ztp6C0hYWG2IAIRV7bzma4Lz8MAPghgM7CMQes8/2XMvP3fG+0bq8kP0OpIt8DtQP9AAOQ9XYREB5O8DPdmDhyrwm0hlgZ+8M/35NlBwsb8w9WkJkxYYEaWPB5PXWxJ6JMnRv0M80AEkoC/xIAgxXoXObBd3FAmQBopWs/iAiCADe4nkzSeB+CZmaMnP8AktjZ1Utx68olG8bNKqaNGSeEW16fedrObgV9F5dBluzPcjryQpQ8LHPr5ijRZnIPhQRdDYq294tU+90iwgXFvv9HTSIFFKRqpenmnnNGoFlN/QSCV+q6nG2fGvQj7kFMyOT/lDem8c9gb82aJX/YgOsqSzgVRAItQsOoGxyJZLL9BV+ZWDjQHi8pZLaWiw7CyyDTAlUB/QcjrjlnP9cbEGOWgUYJkJzxgKhOrbcwnn6iX/94F5ar91rKnKCgwHEP6BRlTxLmSEv2qtXcc2wOQhC7iHMJGSHl83UG5B5nKXBAF4HLIddMvTueNkTl3UtaNjsqaaC5Xv0gOmbuwzrrZP0solvpso2QRc0XQAwzTuCM1cdvWymGEca7PzLv9eXO123KtimfaaawjvG0tmcsW1rCKVnvn+gzxzFBqn1nwo7gXuI9VmEsKyXp2cTyTKNCHLNYUuZqzMW/bOsrF4OBhAPUOYyydoaseBgzeZWHk1Oh+rDMai5B6T52wP9sKuKyZCtNIVYdWlcfFmo0hyBrHivK4adjV2a5nJYvunHS08vCmisRY0V9zcSHy0mJ9B1viN2gOCubaVVSet/PXCTjn0QzUL7ztFwnXdSs8N5MNw17hhvVQo3H5gVE4l/Je/1VC5UeCrXDzAMIG6Se7Dn0wqpYLQUfZ8iZcpcpzsnbRA8a9IUPVJU/VjaJVqeV9IqQh76MRACFlyjGr6VZiC4ZxKZ77fNCQbvvK2h73wlb3vqw3zgQWhmmkV9mfXBApP6iV5OFX1pFRNDeulLPRz4cSgT6IsC82V+vK2CCkT33KU4PBZgOzAZI0ly0iHpElOEO43zRT+0YizUwE/voDumwZThkk7Vy/GbNP1WPRRsCvPyaRsaRAfKdROCcwSQ85/65HKa2SLfcz7re3Yw5PAjs86y3f9GAmrfX2wO96OKcLP4lEtvHYdJDDcQKpIp4nqR1V3/UMBllqz7PdnOsu1jQq4hdFFWkxvpS5njDB8z4JJOqZ3H+Q7szF9zuD4f9P8Lg+BsUnTgAAAABJRU5ErkJggg==" alt="icon"></img> 
                                <div className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                                    <h3 className="fw-bold pt-3">
                                        {t('about.stats.branches.title')}
                                    </h3>
                                    <p className="h4">
                                        {t('about.stats.branches.description')}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;