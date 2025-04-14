import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutComponent from '../../Components/Checkout/Checkout';

const stripePromise = loadStripe('pk_test_51RBo9zRo8goi8ugbKRLbRnM6tMxQd1WxuzQxbsN58PU2ohL8W4qiBsBi6R8swy0ckupzA7ZxrpCQvsvTEQsEo3T000btijBzVs');

const Checkout = () => {
    return (
        <>
            <Elements stripe={stripePromise}>
                <CheckoutComponent/>
            </Elements>
        </>
    )
};

export default Checkout;