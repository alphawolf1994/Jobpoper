/**
 * Formats a date string or Date object to DD/MM/YYYY format
 * Handles both MM/DD/YYYY input format and ISO date strings
 */
export const formatDateDDMMYYYY = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return 'N/A';
  
  let date: Date;
  
  // If it's already a Date object, use it
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    // Check if the string is in MM/DD/YYYY format
    const mmddyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateInput.match(mmddyyyyPattern);
    
    if (match) {
      // Parse MM/DD/YYYY format
      const month = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      date = new Date(year, month - 1, day);
    } else {
      // Try to parse as ISO date or other standard formats
      date = new Date(dateInput);
    }
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  // Format as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  
  return `${day}/${month}/${year}`;
};

