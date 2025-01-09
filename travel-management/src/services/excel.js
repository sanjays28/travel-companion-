import * as XLSX from 'xlsx';

// PUBLIC_INTERFACE
/**
 * Parse Excel file and return JSON data
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Parsed data as array of objects
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!isValidExcelFile(file)) {
      reject(new Error('Invalid file format. Please upload an Excel file (.xlsx, .xls)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        if (!isValidItineraryData(json)) {
          reject(new Error('Invalid itinerary data format. Please check the template.'));
          return;
        }

        resolve(json);
      } catch (err) {
        reject(new Error('Error parsing Excel file: ' + err.message));
      }
    };
    reader.onerror = (err) => reject(new Error('Error reading file: ' + err.message));
    reader.readAsArrayBuffer(file);
  });
};

// PUBLIC_INTERFACE
/**
 * Check if file is a valid Excel file
 * @param {File} file - File to check
 * @returns {boolean} True if file is valid Excel file
 */
export const isValidExcelFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ];
  return validTypes.includes(file.type);
};

/**
 * Validate itinerary data structure
 * @param {Array} data - Parsed Excel data
 * @returns {boolean} True if data is valid
 */
const isValidItineraryData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Required fields for itinerary data
  const requiredFields = ['date', 'activity', 'location'];
  const firstRow = data[0];

  return requiredFields.every(field => 
    Object.keys(firstRow).some(key => 
      key.toLowerCase().includes(field.toLowerCase())
    )
  );
};