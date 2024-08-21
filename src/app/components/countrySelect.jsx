// Import necessary modules
import React from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// Define a functional component for country selection
const CountrySelect = ({ value, onChange }) => {
  // Get the list of countries from the imported module
  const options = countryList().getData();

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#FFFFFF", // White background color
      color: "#FFFFFF", // White text color
      borderColor: "#4B5563", // Tailwind's border-gray-600 color
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#FFFFFF", // White text color for selected value
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1F2937", // Tailwind's bg-gray-800 color for dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3B82F6" : "#1F2937", // Tailwind's bg-blue-500 for selected, bg-gray-800 for unselected
      color: state.isSelected ? "#FFFFFF" : "#FFFFFF", // White text for selected and unselected options
      "&:hover": {
        backgroundColor: "#3B82F6", // Tailwind's bg-blue-500 for hover
        color: "#FFFFFF", // White text color on hover
      },
    }),
  };

  return (
    // Render a Select component from 'react-select' module
    <Select
      // Pass the list of countries as options for the Select component
      options={options}
      // Set the current value of the Select component by finding the option that matches the passed value
      value={options.find((option) => option.value === value)}
      // Pass the onChange function to handle changes in the Select component
      onChange={onChange}
      // Set the CSS class for the Select component
      className="react-select-container"
      // Set the prefix for the CSS classes in the Select component
      classNamePrefix="react-select"
      // Pass the custom styles to the Select component
      styles={customStyles}
    />
  );
};

// Export the CountrySelect component for use in other modules
export default CountrySelect;
