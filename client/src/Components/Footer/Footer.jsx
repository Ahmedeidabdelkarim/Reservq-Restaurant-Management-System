import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import ReserqLogo from '../../assets/Reserq-logo.svg';
import gsap from 'gsap';
import './Footer.css';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const footerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.fromTo(footerRef.current, {
              opacity: 0,
              y: 50
            }, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                toggleActions: "play none none reverse",
              }
            });
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, [i18n.language]);

  return (
    <footer className="footer" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Container ref={footerRef}>
        <Row>
          <Col xs={12} md={12} lg={4}>
            <div className="footer-logo">
              <img src={ReserqLogo} alt="ReservQ Logo" /> 
              <p className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                {t('footer.description')}
              </p>
              <ul className="social-icons">
                <li>
                  <a className='social-icon' href='https://www.facebook.com/' target='_blank' rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                </li>
                <li>
                  <a className='social-icon' href='https://twitter.com/' target='_blank' rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </li>
                <li>
                  <a className='social-icon' href='https://www.instagram.com/' target='_blank' rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </li>
                <li>
                  <a className='social-icon' href='https://www.youtube.com/' target='_blank' rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} md={12} lg={8}>
            <Row>
              <Col xs={12} md={3} lg={3}>
                <h3 className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                  {t('footer.quickLinks.title')}
                </h3>
                <ul className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                  <li><Link className='footer-link'>{t('footer.quickLinks.myAccount')}</Link></li>
                  <li><Link className='footer-link'>{t('footer.quickLinks.aboutUs')}</Link></li>
                  <li><Link className='footer-link'>{t('footer.quickLinks.storeLocator')}</Link></li>
                  <li><Link className='footer-link'>{t('footer.quickLinks.delivery')}</Link></li>
                  <li><Link className='footer-link'>{t('footer.quickLinks.pickup')}</Link></li>
                </ul>
              </Col>
              <Col xs={12} md={3} lg={3}>
                <h3 className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                  {t('footer.terms.title')}
                </h3>
                <ul className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                  <li><Link className='footer-link'>{t('footer.terms.trust')}</Link></li>
                  <li><Link className='footer-link'>{t('footer.terms.termsOfUse')}</Link></li>
                  <li><Link className='footer-link'>{t('footer.terms.privacyPolicy')}</Link></li>
                </ul>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <h3 className={i18n.language === 'ar' ? 'text-end' : 'text-start'}>
                  {t('footer.newsletter.title')}
                </h3>
                <div className={`newsletter-form ${i18n.language === 'ar' ? 'd-flex flex-row-reverse' : 'd-flex'}`}>
                  <input type="email" placeholder={t('footer.newsletter.placeholder')} />
                  <Button className={i18n.language === 'ar' ? 'ms-2' : 'ms-2'}>
                    {t('footer.newsletter.subscribe')}
                  </Button>
                </div>
                <h4 className={`mt-3 ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
                  {t('footer.payment.title')}
                </h4>
                <div className="payment-icons pb-sm-5">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAqCAYAAADrhujJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPESURBVHgB7VpPSBRRGP9mWz1kfzaj8JJ/IAK3gyskFATuVgfrYB48BukxKFQIOlVolzqlFHQJXDvKgnapoIOrCIVKroGeIldPUWJrlJSB0/tNvtlv385sO3Po4JsfPGfmvTfvfb/v+97vvXXXIAHTNOvFZViUmCgR2p3IiDJkGEYSD8YO6XnavYRV9AnygyA+Jh46SB/kRGkAcZP0Q3OI9EREV+IUENcNAXHdEBDXDQFx3RAu2fr7G5lfFx2bjKNniupym1uUya7bz/VH9lklvfSpqI4D7QviPbwf2VtJTfXVFBMF9yoyK6Lfjy3rPlJVSbG6avKD0sQrDliX7Y+jtL08WtAE4uHzqYK68dlV6n4ybT/PP2i3SCUGXtl1E3fabOJoQ//sl+9FU3ecqqWxm+cK6vpGZmjw5ZL9DOfM328nP/hnqoPgntMPKdz+lt6HLtj15uc3RX2HFKMQjY3NrYI+qAfG51YthziR5v0k0I+TBjI7WeIH4XI7GlXHaHr/LRp4XUNPm1MUqfhJZm6RjMhJ2zCe5j0Xo9Y1vZhPc6SuTF9ETwIZgP5IXaTxgkjnJoV4fyrjaBfm9ZPuZRMHLrfUUu+zRmrZuE6z8cd0eD1PnBsGIh2irzRMQkYRdby+V5DuuRQtOTfXCYwjnTwpHOuHuCdVB6E6UVY2D1HnzBUr4k6GxaM1dmSza4y4i4FI4ZHJD+SGpGiTjgLpeGON3Qax8wPP21ki+nfSqbUGGpn7Zd2DNI/g3c5Y3jBF5eU1Hs0bj3e7hMg13Eg5rnmuHVgSfBlwh3uBZ+KtzOB7705YVx4tEJIE1Whwg4evnXUUMJDn42EM7jyMrzrNj8B5Jo5txp40F7LUOckMvdp63L5fUaIH8ZKAc7AVwQHqvt4rhE+SGXqxVDC3PAfwsbhjyoVn4tahgUWKGwaDuhhxbhDWvNMaR//lR50FDpUHIUSTOxXP2Pf5WQFY+B/EAS4uqqhxcOJuiu72rjq2NZ5IezgCRZ7enPqVA0/bmQS2NfUwAXBRA7ii2yovSOPgwtcqSCSn8pGV4of1Xg78KLsv4k4py0XNNsgh4jItESWnSGEpYd0/F9rBMwPHVz6vdKC8l+f8cuEr1WGcmppc1AA3RT9Y5W4cxpy43WZdBxXt4MImM4ILnNd09/2FAjzM15kabYBHDEbyiMBQOQbeVT+NlXrXyQa3Pi5I6PpNSiL4D4xuCIjrhoC4bgiI6wYQz5GGAPEM6YWsYRhpEO8mvaLejz8hwT4rrs2ijNPuRprw4WTnB35/AN8JvcCtGQ+NAAAAAElFTkSuQmCC" alt="img"/>                        
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAqCAYAAADrhujJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOsSURBVHgB7ZpdSBRRFMfPaKmF6y4quLZmG7SxpaAWfVNK5YO+aEvlS5FG+BBJPQh9URiUCBmlPlVUCD3oQ6EPoaGhJIYGrUGmpoWrZq6lte6uqSs23XNnZ9QUc8YS8c4Pzt4792N2/uece2dmWQ688Dx/lhTniBlheeIgVkbsGsdxNg5biOjbIIhmARuxOF8i2kgqJcAOOmJjPuQjFdgjFoXrgD20PsAoqnDWUIWzhiqcNVThrMGs8BWggM99jmnHWk0AaAIDYCE4Pb9gaGxi8pz+vhDk9/e4iPPmO15EkfD9RwpmtGWdTCAWD0q5af0G95t/TGtbG7gSXljWzynoXvN3yLcOwKNEAySt08B8kZ3qrR/ttAwiEUah2+OM9LjoYS243KOglPeDY7RM26ilhmJ73ONQ0u6Y1zytny/IQXbEnS5B3CaTnkb5IHFESvpdqR8d02i1SWN67Q6I0OtAQ5ZDa4cddhBHGfTCC2Fjk432YxuKRDKjgiEqxB96XOPwqu+n8J0knSu6XLQtOkRYUkOeCRrhbu88sf2/CceLR3hi1XVt5OK7JJFVL9vgQm65NBbXPWZB+tGdsEavhdzC52BJioG8y6lU8PGsYjCE68B8K5KKQrrdHqi3D0uiMZIHnnZKjplK2iktifgozQ4561uRcLxg5DWJFhoVqBHS/vTFUiok71IKRJDy/I1yOsZARB9KjqXCq+s+0DnHzhTTMisjHhwrJ6OVUdUr1bO3hFIHoGisZ0YHQ2n7EFxp6IeoYH8pzeVGW5Hw1o5+WmIUzaYwWk/ca6Zpi2zeEEZTFxFT2kyyAfcE3A/QEeggdCCew0IcUtnlpuNwM8veGirVd4evhm2lnyQnINiG4C6O6Q6LJ1xIdUxZFCQi3s5aiGPQCZjiuBToRXr7LMkxVDi2Y2aId4HmQWHfSDJqIM2knfV7cfeO1PhB/psBeoxixXkRgfJvTrJmOIkYceeeKhrBKGNbG3GMuHb/HCtmAvK46ITkLDFlZxOAmx2m9tWGr/RYXMu7wldJmaIk4vjTcg4vgwZrJ9/S3jdnP5rTNTJj7PWCSt60J4cvfFA7bU63y8PXfxnmyYPIrOfE/gqbi/ZPHYv1dwMjvAJqZAtXypNnTVR0wuE7/BKgRtGTmxIS95np5oaPt0uBRROO63mhz/P/EvW1lDVU4ayhCmcNVThrqMJZA4U7gEFQ+Ftgj2IfjuNqSaUA2MFGrIyucSIe/+OW4W1cruCSxgDHEb2O35rpEU2conVJAAAAAElFTkSuQmCC" alt="img"/>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAqCAYAAAAERIP3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAN+SURBVHgB7ZpNTxNBGMf/s9sWGhEr0agHtSZ68ELXuzHFCycBPwAKB28a8eBNA0Q+gMS7kvgBCEdjDMVED1wADxIJhooeOBjAhNfS7vo8I1XeCp1nSiIsv2Q67c42s//nZWfnaRXWCYIgTV0ntTQOLxlq7UqpLH9Q/ELC26h7hXAwT62BDDBaFD9FXRLhIUPiGxQJ9+jDCEIGiVcO9QmEFAch5kh8WIlgn/Cz33RjVOIEXC9V9neDHK1GC1mAe6bOg4pV/tZUUfH5zBCWu3uQH/2EYH5+23g0fQOxtlZU3b2zbYwF++O98Cf7ELDwLaiaJNTZNNxUp35fCdT6k90gLGDRC+33/np6L5zkRcS7nmgjaNFj3Sh8fo5ycS63WRuBlzpr8cvdz7Dc1QMJ8Y5WRK6/29HTe8HCIw39UHUeJBTXeTE2wp1jAaqmX8IZzkICG2ztTQOC2VFIEYtf6X0hFq6iAWob83BqArgzgDsBGZQy2gCCyGFE4jm3pcKZuOdr4UXcH3Qhc5BBBih8aIcEkfglCved7uZlTUjhXn21sO24m4UYfyaDgJrxtcAQ9nqu7zWkxFOFHY+rOQvvEwVaMUwxFr+WeQ8bomeDkmPOT4jR3s+ZRaOx+NzAAKS4Jzfn+laUhec1hqFvLD6Y/wUpTmz3cbUCK/yF8h6yipjn/JTZBJsmq9njhDzs2O+wP0wYi3ev1UNKfnaPE2y3WYY7P3PxySSk+Iu7TxcchxVOXfnbZn0+DIk1N0FKkCPvz6iS4/4pyCGv85bXBGPxEdqTOwl5YSH3vfSU/mmIcc63wBTRDa+q4z6krH51dQRsxT9HkVENMa7XCVNE4qsfPtAFCQksfGnM3XyMRBcuQYy0sCESryjsawffisN/ddzF6uS/qQtXLLxOxQzX64IE8TrPnj9uYYDFjxFtAPa4ONfJ21Gq5kixeshxvXrUjgyLUoCjRz2mC28xz1WGb3DRWyNWdTzrJzwWnpiaQLzzaVlGYNFVVMFNTH1BrKVJhyyLcM6kUQ7qpIdI4yAiN/uty9kVqd5uZJX2+vmhIRQ21O0ZLlu7qZQWrkqkCtfj/OkBXZjYWJrS3qXcdi40wzFcy0tRkertQcW6envQORIfVkIvXlaDPgQ4/K8khM8AGX4phv0jhAd2tP6JR4sn7/dRd5ua/Fe//x8WncGf/+Bl+cBvccksCzFp7IoAAAAASUVORK5CYII=" alt="img"/>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAqCAYAAADrhujJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATxSURBVHgB7ZptTFtVGMf/bXmTlgxQoTU4ZigzSiJtmu2DgIpRBgtqNsaM0cAwISG+LBk6dEucEiNmksVtiRpNhEEwIAyyZC44TNwSwKgJWTHzw2BEgsa284MlvUXWstXnOV0vLZT0JQSFyy95uOfcc27hf56Xc++lKhA+n28bHdrJTGTp2JhYyU6pVKoz3FHdEX2JbBuUwSESf5KFs6cPQDk4yR5g4X9j44b3SpjVUJ5oJl0NhbIpXGlsClcam8KVhmKFJyAOfG4XPNYxLExNir4m24AkkwVqOq4XYhLOguf6ezBPdpvaS0kpq4S2tn7FBRj89iJsdkfIOYM+G2aTCXo6riVRC2fRzsYG2cvhmB/6Bt6pCWR+3hV2fPDiEK5Yx8OOHX2rCRXlZVgrohY+e6wpRHRioQUJeflQ6dJwi87fHL0sPL2luTXiZ/V2fyW37XY7Pjz+EVrI9ML7hVgLohLu+XEA3vExua+tqUcqWTC37DZx1Ogj57khKKy5fYS8ffDQGxgeGf1/CdeoP0DqUzb8M2xA6vMNy0SLOfr4C1tA7PXrU+LI6TA8OgpJckOn06KkqEjMkSRJLI5er1+2QHaqHVesVuQbjTAa8yL+zsjCF5zwuX5B8g4K7+2z0DxaGTI8MrEA6Wb4S4u3a6BLViESLIbhP7i9oxNtZzpF35CdDcktoe/sAF4+UIO62hqc/uQzMTZ4/lzIZ7R1dFDxHEJfdxeiIaJwn2uxGKlzHlrm2U+/88IxezvstYYXU1CYq1l2nqt7ALvDgd6z/Ugjz+7ft5cW4QeYCwtx9O3DwrNcA1qOt4rFMNH56qq9YnE4KgJe90eC/zq+ZlWEqxKD3lN4nVgNWEgwnOct7zeLP7qaxLPZROiOU6jrqOIfRvULL2GSUoEXp69/QIg3m06I6zliWHxF+S5ES+RQT8mVm5OSEzneOaQlpsrnqnYmQJr3yf2Bnzn0/X3tXeFvDE9/fEJus7D8oJzkPD/yzjGRs4tztOLI4nh+xa4yIT7Q5zYvXizbYWThCelQZTyOnj//wJdzD6Ly6tdoNNfJw1U7EuW2Y9aHzmGvaOu3qGDMCp/fK1VuFsui3STo4KuvoLi4SC5o7OEAu8v9wnsp9x+jORwJfB8QC1FVdes9jTg52Sba3RMXkJakRX3B/pA5Npcbb3YtejhcbkfCRvnM4l8n0RzufrKF+PaOxXlGqty8eCze7rCLc2bTI4iFqIRbtu6GZeonjN34VfS/uNqL879dwhM5O6FL0GLSOS3GPOqnkYw9wts1JUmIl4AYhrc0vrlZCld43vu5knPoR1vUAkR959Za3ISG79/FBIlkbO6/0H3tQuikzHNIybiG5tJmIT5W2IvCkxTCnOssZnhkBPl5xpCcD8zl2sBhzltdrGjeI6KZmKxJQpXRXzxsczcgUZFbiuXeApx68jXkZujCfoaLvHd3ZiZKKC9Xgsc8Hg9mZn4nm8Fzzz4jhLHn+WEmd+v98tyu7h6xKNX7qhAjHfwPBR/igEObve/yuHGfNguWrIdhoONawfcCvC3G+XBTGtfzOGPJKhD2X8FPerFuYcGsyzcwfGPDVldbi3hZt6+euKrHuoUFE3eOr3NKN9+yKo1N4UpD0cJX5+3COoOFW6EspsmsLLzuTkcp8HfdnGr6MU2dUjJ+1N/IYX+ZbA9/x407/wJr7+LR5f4B2gAAAABJRU5ErkJggg==" alt="img"/>
                    </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="copyright mt-2">
        <p className="text-center">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;