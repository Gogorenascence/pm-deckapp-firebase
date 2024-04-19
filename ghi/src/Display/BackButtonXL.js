import React from 'react';

const BackButtonXL = () => {
    const handleGoBack = () => {
    window.history.back();
    };

    return (
        <button
            onClick={handleGoBack}
            className="media-button wide100-3 none"
        >
            Back
        </button>
    );
};

export default BackButtonXL;
