import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

// Adding some custom CSS to override react-datepicker to match Tailwind design
const customStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding-right: 64px !important;
  }
  .react-datepicker {
    font-family: inherit;
    border-color: #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    display: inline-flex !important;
  }
  .react-datepicker__month-container {
    float: none !important;
  }
  .react-datepicker__time-container {
    float: none !important;
    border-left-color: #e2e8f0 !important;
    width: 105px !important;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    width: 100% !important;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
    height: 240px !important;
    overflow-y: auto !important;
  }
  .react-datepicker__header {
    background-color: #f8fafc;
    border-bottom-color: #e2e8f0;
    border-top-left-radius: 0.5rem !important;
    border-top-right-radius: 0.5rem !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }
  .react-datepicker__current-month {
    margin-bottom: 8px !important;
    font-size: 0.95rem !important;
    color: #1e293b !important;
  }
  .react-datepicker__navigation {
    top: 9px !important;
  }
  .react-datepicker__navigation--previous {
    left: 10px !important;
  }
  .react-datepicker__navigation--next {
    right: auto !important;
    left: 196px !important;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #94a3b8 !important;
    border-width: 2px 2px 0 0 !important;
  }
  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #0f766e !important;
  }
  .react-datepicker__header__dropdown {
    display: flex !important;
    justify-content: center !important;
    gap: 8px !important;
    margin-top: 8px !important;
    margin-bottom: 4px !important;
  }
  .react-datepicker__month-dropdown-container, .react-datepicker__year-dropdown-container {
    margin: 0 !important;
  }
  .react-datepicker__header select {
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    padding: 4px 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
    outline: none;
    cursor: pointer;
    margin: 0;
    width: 95px !important;
  }
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected, .react-datepicker__time-list-item--active {
    background-color: #0d9488 !important;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #14b8a6 !important;
  }
  .react-datepicker__close-icon {
    right: 36px !important;
    top: 50% !important;
    bottom: auto !important;
    transform: translateY(-50%) !important;
    height: auto !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .react-datepicker__close-icon::after {
    background-color: transparent !important;
    color: #94a3b8 !important;
    font-size: 25px !important;
    font-weight: 300 !important;
    padding: 0 !important;
    line-height: 11px !important;
    margin: 0 !important;
    content: "×" !important;
    transition: color 0.2s;
  }
  .react-datepicker__close-icon:hover::after {
    color: #f43f5e !important;
  }
`;

interface CustomDatePickerProps {
  id?: string;
  value?: string;
  onChange?: (e: any) => void;
  className?: string;
  placeholder?: string;
  type?: 'date' | 'datetime-local';
}

export function CustomDatePicker({ id, value, onChange, className, placeholder, type = 'date' }: CustomDatePickerProps) {
  const isTime = type === 'datetime-local';
  
  const parsedDate = value ? new Date(value) : null;

  const handleChange = (date: Date | null) => {
    if (!onChange) return;
    
    let strValue = '';
    if (date) {
      if (isTime) {
        // format: yyyy-MM-ddThh:mm
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        strValue = `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
      } else {
        // format: yyyy-MM-dd
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        strValue = `${yyyy}-${MM}-${dd}`;
      }
    }
    
    // mimic native event
    onChange({ target: { value: strValue, id: id } });
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="relative w-full">
        <DatePicker
          id={id}
          selected={parsedDate}
          onChange={handleChange}
          showTimeSelect={isTime}
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat={isTime ? "MMMM d, yyyy h:mm aa" : "yyyy-MM-dd"}
          placeholderText={placeholder || "Select date..."}
          className={className}
          isClearable
          shouldCloseOnSelect={true}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Calendar size={18} />
        </div>
      </div>
    </>
  );
}
