import React, { useState } from "react";

const ImageUpload = () => {

    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div>
        <h1>Upload and Display Image using React Hook's</h1>

        {selectedImage && (
            <div>
            <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
                title={URL.createObjectURL(selectedImage)}
            />
            <br />
            <button onClick={() => setSelectedImage(null)}>Remove</button>
            </div>
        )}

        <br />
        <br />

        <input
            type="file"
            name="myImage"
            onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
            }}
        />
        </div>
    );
};

export default ImageUpload;
