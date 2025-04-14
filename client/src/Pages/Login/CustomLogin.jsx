import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./CustomLogin.css";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const CustomLogin = () => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email(t('login.errors.email.invalid')).required(t('login.errors.email.required')),
    password: yup.string().required(t('login.errors.password.required')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const toastLoadingId = toast.loading("Waiting...");
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      
      const result = await response.json();
      console.log(result);
      toast.dismiss(toastLoadingId);

      if(response.ok){
        localStorage.setItem("role", result.role);
        localStorage.setItem("token", result.token);
        localStorage.setItem("data", JSON.stringify(data));
        
        toast.success(`${result.role === "admin" ? "Admin" : "User"} login successful! Redirecting...`, {
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate(result.role === "admin" ? "/admin" : "/home");
        }, 2000);
      } else {
        if(result.message === "User not exists"){
          toast.error("Email not exists");
          return;
        }
        toast.error(result.message);
      }
      
    } catch (error) {
      setTimeout(() => toast.error("An error occurred. Please try again."), 2500);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Row className={`bg-white flex-column-reverse flex-md-row min-vh-100 max-vh-100 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <Col md={6} className="d-md-flex align-items-center justify-content-center photo h-100">
          <img
            src="https://reservq.vercel.app/assets/login-008671bf.png"
            alt="Illustration"
            className="img-fluid vh-100 vw-100"
          />
          <div className={`underimage ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
            {t('login.terms')}{" "}
            <a href="/#" className="text-danger">{t('login.termsLink')}</a>
          </div>
        </Col>

        <Col md={6} className={`${i18n.language === 'ar' ? 'text-end' : 'text-start'} p-5`} style={{ marginTop: "2%" }}>
          <h2 className="mb-3 font-size-10">{t('login.title')}</h2>
          <p className="font-size-10">{t('login.subtitle')}</p>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
              <Form.Label className="font-size-10">{t('login.email')}</Form.Label>
              <Form.Control 
                style={{ outline: 'none', boxShadow: 'none' }} 
                type="email" 
                placeholder={t('login.emailPlaceholder')} 
                {...register("email")} 
                className="p-3" 
              />
              {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="font-size-10">{t('login.password')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.passwordPlaceholder')}
                  {...register("password")}
                  className="p-3"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <Button 
                  style={{ width: "50px", height: "58px" }} 
                  variant="outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible className="fs-2" /> : <AiOutlineEye className="fs-2" />}
                </Button>
              </InputGroup>
              {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
            </Form.Group>

            <p className={`${i18n.language === 'ar' ? 'text-start' : 'text-end'}`}>
              <Link href="#" className="text-danger" to="/forget-password">
                {t('login.forgotPassword')}
              </Link>
            </p>

            <Button variant="danger" className="w-100 mb-3 py-3 bg-danger" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('login.signingIn') : t('login.signIn')}
            </Button>

            <p className="text-center mt-3">
              {t('login.noAccount')} <Link to="/signup" className="text-danger">{t('login.signUp')}</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CustomLogin;
