import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';

const schema = yup.object().shape({
  firstName: yup.string().required("signup.errors.firstName.required"),
  lastName: yup.string().required("signup.errors.lastName.required"),
  email: yup.string().email("signup.errors.email.invalid").required("signup.errors.email.required"),
  password: yup.string()
    .min(6, "signup.errors.password.min")
    .matches(/[a-z]/, "signup.errors.password.lowercase")
    .matches(/[0-9]/, "signup.errors.password.number")
    .required("signup.errors.password.required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "signup.errors.confirmPassword.match")
    .required("signup.errors.confirmPassword.required"),
});

const CustomSignup = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      toast.dismiss(toastLoadingId);

      if (response.ok) {
        toast.success(t('signup.success'));
        navigate("/login");
      } else {
        if(result.message === "User already exists"){
          toast.error(t('signup.emailExists'));
          return;
        }
        toast.error(t('signup.error'));
      }
    } catch (error) {
      toast.dismiss(toastLoadingId);
      toast.error(t('signup.error'));
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
          <div className={`underimage text-center ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}>
            {t('signup.terms')}{" "}
            <a href="/#" className="text-danger">{t('signup.termsLink')}</a>.
          </div>
        </Col>

        <Col md={6} className={`${i18n.language === 'ar' ? 'text-end' : 'text-start'} px-5 py-1 mt-5`}>
          <h2 className="mb-2 font-size-6">{t('signup.title')}</h2>
          <p className="font-size-5">{t('signup.subtitle')}</p>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-2">
              <Form.Label className="font-size-6">{t('signup.firstName')}</Form.Label>
              <Form.Control 
                style={{ outline: 'none', boxShadow: 'none' }}  
                type="text" 
                placeholder={t('signup.firstName')} 
                {...register("firstName")} 
                className="px-3 py-2" 
              />
              {errors.firstName && <Form.Text className="text-danger">{t(errors.firstName.message)}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="font-size-6">{t('signup.lastName')}</Form.Label>
              <Form.Control 
                style={{ outline: 'none', boxShadow: 'none' }} 
                type="text" 
                placeholder={t('signup.lastName')} 
                {...register("lastName")} 
                className="px-3 py-2" 
              />
              {errors.lastName && <Form.Text className="text-danger">{t(errors.lastName.message)}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="font-size-6">{t('signup.email')}</Form.Label>
              <Form.Control 
                style={{ outline: 'none', boxShadow: 'none' }} 
                type="email" 
                placeholder={t('signup.email')} 
                {...register("email")} 
                className="px-3 py-2" 
              />
              {errors.email && <Form.Text className="text-danger">{t(errors.email.message)}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="font-size-6">{t('signup.password')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder={t('signup.password')}
                  {...register("password")}
                  className="px-3 py-2"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <Button 
                  variant="outline-secondary" 
                  style={{height: "42px"}} 
                  onClick={() => setShowPassword(!showPassword)}
                  className={i18n.language === 'ar' ? 'me-2' : 'me-2'}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </Button>
              </InputGroup>
              {errors.password && <Form.Text className="text-danger">{t(errors.password.message)}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="font-size-6">{t('signup.confirmPassword')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('signup.confirmPassword')}
                  {...register("confirmPassword")}
                  className="px-3 py-2"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <Button 
                  variant="outline-secondary" 
                  style={{height: "42px"}} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={i18n.language === 'ar' ? 'me-2' : 'me-2'}
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </Button>
              </InputGroup>
              {errors.confirmPassword && <Form.Text className="text-danger">{t(errors.confirmPassword.message)}</Form.Text>}
            </Form.Group>

            <Button variant="danger" className="w-100 mb-3 py-2 bg-danger" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('signup.signingUp') : t('signup.signUp')}
            </Button>

            <p className="text-center mt-2">
              {t('signup.alreadyHaveAccount')}
              <Link className={`text-danger ${i18n.language === 'ar' ? 'me-1' : 'ms-1'} text-decoration-underline cursor-pointer`} to="/login">
                {t('signup.signIn')}
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CustomSignup;
