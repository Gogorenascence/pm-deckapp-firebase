import React from "react"

export function shortenedText(text) {
    if (text.length > 75) {
        return text.slice(0, 75) + "...";
    }
    return text;
}

export function adjustFontSize() {
    const textMeasure = document.querySelector('.cd-measure');
    const textElement = document.querySelector('.cd-title');
    const containerElement = document.querySelector('.cd-title-container');
    if (textElement && containerElement) {
        const textWidth = textMeasure.scrollWidth;
        const containerWidth = containerElement.offsetWidth;
        console.log(textWidth, containerWidth)
        if (textWidth > containerWidth) {
            const fontSize = 37;
            textElement.style.fontSize = fontSize + 'px';
        } else {
            const fontSize = 45;
            textElement.style.fontSize = fontSize + 'px';
        }
    }
}

// export function beforeLeaving() {
//     window.addEventListener('beforeunload', function (event) {
//         // Cancel the event
//         event.preventDefault();
//         // Chrome requires returnValue to be set
//         event.returnValue = '';

//         // Custom message to display in the confirmation dialog
//         const confirmationMessage = 'Are you sure you want to leave this page? Your changes may not be saved.';

//         // Display the confirmation message
//         event.returnValue = confirmationMessage;
//         return confirmationMessage;
//     });
// }

function objectsAreEqual(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    for (const key of obj1Keys) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}

export function getKeyByValue(obj1, obj2) {
    return Object.keys(obj1).find(key => objectsAreEqual(obj1[key], obj2));
}

// useEffect(() => {
//     adjustFontSize();
//     window.addEventListener('resize', adjustFontSize);

//     return () => {
//         window.removeEventListener('resize', adjustFontSize);
//     };
// }, []);


export function todaysFormattedDate() {
    const timeZone = 'America/Chicago';
    const options = { timeZone: timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
    const adjustedDate = new Intl.DateTimeFormat('en-US', options).format(new Date());
    const formattedDate = new Date(adjustedDate).toISOString().split('T')[0];
    return formattedDate;
}

export function compressCard(link) {
    return link.replace("https://playmakercards","https://compressedplaymakercards")
        .replace("png", "jpg");
}
