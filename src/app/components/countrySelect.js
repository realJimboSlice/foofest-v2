// Import necessary modules
import React from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// Define a functional component for country selection
const CountrySelect = ({ value, onChange }) => {
  // Get the list of countries from the imported module
  const options = countryList().getData();

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
    />
  );
};

// Export the CountrySelect component for use in other modules
export default CountrySelect;
