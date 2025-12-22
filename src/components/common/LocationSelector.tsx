import { useState, useEffect, forwardRef } from 'react';
import { Country, State, City } from 'country-state-city';
import { Select } from './Select';
import formStyles from '../../styles/form.module.css';

interface LocationSelectorProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export const LocationSelector = forwardRef<HTMLSelectElement, LocationSelectorProps>(
  ({ label, error, hint, required, value, onChange, name }, ref) => {
    // Parse the value format: "City, State, Country"
    const parseLocation = (locationString?: string) => {
      if (!locationString) return { city: '', state: '', country: '' };
      const parts = locationString.split(', ');
      if (parts.length === 3) {
        return { city: parts[0], state: parts[1], country: parts[2] };
      }
      return { city: '', state: '', country: '' };
    };

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Initialize from value prop
    useEffect(() => {
      if (value) {
        const { country, state, city } = parseLocation(value);
        setSelectedCountry(country);
        setSelectedState(state);
        setSelectedCity(city);
      }
    }, []);

    // Get all countries
    const countries = Country.getAllCountries();

    // Get states for selected country
    const states = selectedCountry
      ? State.getStatesOfCountry(
          countries.find((c) => c.name === selectedCountry)?.isoCode || ''
        )
      : [];

    // Get cities for selected state
    const cities =
      selectedCountry && selectedState
        ? City.getCitiesOfState(
            countries.find((c) => c.name === selectedCountry)?.isoCode || '',
            states.find((s) => s.name === selectedState)?.isoCode || ''
          )
        : [];

    // Handle country change
    const handleCountryChange = (countryName: string) => {
      setSelectedCountry(countryName);
      setSelectedState('');
      setSelectedCity('');
      onChange?.('');
    };

    // Handle state change
    const handleStateChange = (stateName: string) => {
      setSelectedState(stateName);
      setSelectedCity('');
      onChange?.('');
    };

    // Handle city change
    const handleCityChange = (cityName: string) => {
      setSelectedCity(cityName);
      // Format: "City, State, Country"
      const fullLocation = `${cityName}, ${selectedState}, ${selectedCountry}`;
      onChange?.(fullLocation);
    };

    return (
      <div className={formStyles.formGroup}>
        <label className={`${formStyles.label} ${required ? formStyles.required : ''}`}>
          {label}
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Country Selector */}
          <Select
            label="País"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            options={[
              { value: '', label: 'Selecione o país' },
              ...countries.map((country) => ({
                value: country.name,
                label: country.name,
              })),
            ]}
            required={required}
          />

          {/* State Selector */}
          <Select
            label="Estado/Região"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            options={[
              { value: '', label: selectedCountry ? 'Selecione o estado' : 'Primeiro selecione o país' },
              ...states.map((state) => ({
                value: state.name,
                label: state.name,
              })),
            ]}
            disabled={!selectedCountry}
            required={required}
          />

          {/* City Selector */}
          <Select
            label="Cidade"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            options={[
              { value: '', label: selectedState ? 'Selecione a cidade' : 'Primeiro selecione o estado' },
              ...cities.map((city) => ({
                value: city.name,
                label: city.name,
              })),
            ]}
            disabled={!selectedState}
            required={required}
            name={name}
            ref={ref}
            error={error}
          />
        </div>

        {hint && <span className={formStyles.hint}>{hint}</span>}
        {error && <span className={formStyles.error} role="alert">{error}</span>}
      </div>
    );
  }
);

LocationSelector.displayName = 'LocationSelector';
