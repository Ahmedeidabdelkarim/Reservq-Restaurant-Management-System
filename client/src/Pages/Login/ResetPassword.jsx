import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Validation Schema for Password Reset
const resetPasswordSchema = yup.object().shape({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/auth/verify-reset-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error(t('login.invalidToken'));
        setValidToken(true);
      } catch (error) {
        toast.error(error.message);
        navigate("/forget-password");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token, navigate, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  // Handle Password Reset Submission
  const resetPassword = async (data) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || t('login.passwordResetFailed'));

      toast.success(t('login.passwordResetSuccess'));
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  if (!validToken) {
    return null;
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`w-100 p-4 shadow-lg rounded bg-white ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`} style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-3">{t('login.resetPassword')}</h3>
        <p className="text-center text-muted">{t('login.enterNewPassword')}</p>

        <Form onSubmit={handleSubmit(resetPassword)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('login.newPassword')}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t('login.enterNewPassword')}
              {...register("password")}
              style={{ outline: "none", boxShadow: "none" }}
            />
            {errors.password && <Alert variant="danger" className="text-danger">{errors.password.message}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('login.confirmPassword')}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t('login.confirmNewPassword')}
              {...register("confirmPassword")}
              style={{ outline: "none", boxShadow: "none" }}
            />
            {errors.confirmPassword && <Alert variant="danger" className="text-danger">{errors.confirmPassword.message}</Alert>}
          </Form.Group>

          <Button variant="danger" type="submit" className="w-100 py-2">
            {t('login.resetPasswordButton')}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ResetPassword;
