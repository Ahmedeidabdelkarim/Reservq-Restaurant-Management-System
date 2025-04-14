import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Validation Schema for Email
const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });
  const navigate = useNavigate()

  // Handle Email Submission
  const sendResetLink = async (data) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send reset email");
      navigate("/email-sent")
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`w-100 p-4 shadow-lg rounded bg-white ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`} style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-3">{t('login.forgotPassword')}</h3>
        <p className="text-center text-muted">{t('forgotPassword.message')}</p>

        <Form onSubmit={handleSubmit(sendResetLink)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('login.email')}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t('login.emailPlaceholder')}
              {...register("email")}
              style={{ outline: "none", boxShadow: "none" }}
            />
            {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
          </Form.Group>

          <Button variant="danger" type="submit" className="w-100 py-2">
            {t('forgotPassword.sendLink')}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-danger">
            {t('emailSent.backToLogin')}
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
