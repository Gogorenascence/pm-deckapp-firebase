import React from 'react';

const BackButton = () => {
    const handleGoBack = () => {
    window.history.back();
    };

    return (
        <button
            onClick={handleGoBack}
            className="left media-button none"
        >
            Back
        </button>
    );
};

export default BackButton;
