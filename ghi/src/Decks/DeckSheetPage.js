import { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';


function DeckSheetPage({
    name,
    main_list,
    pluck_list
}) {

    const getDeck = async() =>{
        console.log(main_list)
        console.log(pluck_list)
        const imageList = []
        for (let card of main_list) {
            const imageLink = card.picture_url.replace(
                "https://compressedplaymakercards.s3.us-west-1.amazonaws.com/", process.env.PUBLIC_URL + "/card_images/"
            )
            imageList.push(imageLink)
        }
        for (let card of pluck_list) {
            const imageLink = card.picture_url.replace(
                "https://compressedplaymakercards.s3.us-west-1.amazonaws.com/", process.env.PUBLIC_URL + "/card_images/"
            )
            imageList.push(imageLink)
        }
        let sheet = []
        const sheetList = []
        for (let i = 0; i < imageList.length; i++) {
            if (sheet.length < 9) {
                sheet.push(imageList[i])
            } else {
                sheetList.push(sheet)
                sheet = []
                sheet.push(imageList[i])
            }
        }
        sheetList.push(sheet)

        const doc = new jsPDF('p', 'mm', 'a4', true, true);
        sheetList.forEach((sheet, index) => {
            if (index > 0) {
                doc.addPage();
            }
            sheet.forEach((image, i) => {
                const x = (i % 3) * 2.5 * 25.4 + 12.7; // 2.5 inches converted to mm plus half inch margin
                const y = Math.floor(i / 3) * 3.5 * 25.4 + 6.35; // 3.5 inches converted to mm plus half inch margin
                doc.addImage(image, 'JPEG', x, y, 2.5 * 25.4, 3.5 * 25.4, undefined, "FAST");
            });
        });
        doc.save(`${name}.pdf`);
    };

    // useEffect(() => {
    //     getDeck();
    // },[deck_id]);

    // const getPDF = () => {
    //     const doc = new jsPDF('p', 'mm', 'a4', true, true);

    //     sheets.forEach((sheet, index) => {
    //         if (index > 0) {
    //             doc.addPage();
    //         }
    //         sheet.forEach((image, i) => {
    //             const x = (i % 3) * 2.5 * 25.4 + 12.7; // 2.5 inches converted to mm plus half inch margin
    //             const y = Math.floor(i / 3) * 3.5 * 25.4 + 6.35; // 3.5 inches converted to mm plus half inch margin
    //             doc.addImage(image, 'JPEG', x, y, 2.5 * 25.4, 3.5 * 25.4, undefined, "FAST");
    //         });
    //         console.log("dog")
    //     });
    //     doc.save(`${name}.pdf`);
    // }

    return (
        <>
            <button
                className="left heightNorm"
                onClick={getDeck}
                style={{marginRight: "10px", marginLeft: "0px" }}
            >PDF</button>
        </>
    );
}


export default DeckSheetPage;
