import React, { useState } from 'react';
import * as XLSX from 'xlsx';


const DownloadButton = () => {
  const [data, setData] = useState(() => {
    // Load the data from local storage if it exists, otherwise use an empty array
    const newDataFromStorage = localStorage.getItem('newData');
    return newDataFromStorage ? JSON.parse(newDataFromStorage) : [];
});
const formData = localStorage.getItem('formData');

  const handleDownload = () => {
    // Convert the data to an Excel workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'newData');

    // Convert the workbook to a binary Excel file
    const excelFile = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'binary',
    });

    // Trigger the download
    const buffer = new ArrayBuffer(excelFile.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < excelFile.length; i++) {
      view[i] = excelFile.charCodeAt(i) & 0xff;
    }

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element and trigger a click event to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'newData.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
        <p>{formData}</p>
      <button className='submit-btn' onClick={handleDownload}>Download newData</button>
    </div>
  );
};

export default DownloadButton;
