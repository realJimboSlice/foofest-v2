import React from "react";
import Select from "react-select";
import countryList from "react-select-country-list";


const CountrySelect = ({ value, onChange }) => {

  const options = countryList().getData();

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#FFFFFF", 
      color: "#FFFFFF", 
      borderColor: "#4B5563",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000000",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1F2937",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3B82F6" : "#1F2937",
      color: state.isSelected ? "#FFFFFF" : "#FFFFFF", 
      "&:hover": {
        backgroundColor: "#3B82F6", 
        color: "#FFFFFF", 
      },
    }),
  };

  return (
    
    <Select
      // Passes the list of countries as options for the Select component
      options={options}
     
      value={options.find((option) => option.value === value)}
      
      onChange={onChange}
      
      className="react-select-container"
      
      classNamePrefix="react-select"
      
      styles={customStyles}
    />
  );
};

// Export the CountrySelect component for use in other modules
export default CountrySelect;
