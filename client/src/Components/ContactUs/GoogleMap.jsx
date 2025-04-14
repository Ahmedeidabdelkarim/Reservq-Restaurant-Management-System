import React from 'react';
import './styles/GoogleMap.css';
const GoogleMapEmbed = () => {
    return (
        <div className="map-container">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d467599.97423148993!2d89.839737!3d23.707237!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1738179862949!5m2!1sen!2sbd"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
            ></iframe>
        </div>
    );
};

export default GoogleMapEmbed;
