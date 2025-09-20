import i18next from '../config/i18n';

// Convert English location names to Hindi
export const translateLocation = (location: string): string => {
  const key = `weather.locations.${location.replace(/\s+/g, '')}`;
  const translated = i18next.t(key);
  return translated === key ? location : translated;
};

// Convert English weather conditions to Hindi
export const translateWeatherCondition = (condition: string): string => {
  const key = `weather.${condition.toLowerCase().replace(/\s+/g, '')}`;
  const translated = i18next.t(key);
  return translated === key ? condition : translated;
};

// Convert English numbers to Hindi
export const translateNumber = (num: number): string => {
  if (i18next.language !== 'hi') return num.toString();
  
  const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().split('').map(digit => 
    /\d/.test(digit) ? hindiNumerals[parseInt(digit)] : digit
  ).join('');
};

// Convert English date to Hindi
export const translateDate = (date: Date): string => {
  if (i18next.language !== 'hi') return date.toLocaleDateString();
  
  return date.toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Convert English time to Hindi
export const translateTime = (time: Date): string => {
  if (i18next.language !== 'hi') return time.toLocaleTimeString();
  
  return time.toLocaleTimeString('hi-IN', {
    hour: 'numeric',
    minute: 'numeric'
  });
};

// Translate temperature with unit
export const translateTemperature = (temp: number | undefined): string => {
  if (typeof temp !== 'number' || isNaN(temp)) {
    return '--°C';
  }
  const translatedNumber = translateNumber(Math.round(temp));
  return `${translatedNumber}°C`;
};

// Translate percentage values
export const translatePercentage = (value: number): string => {
  const translatedNumber = translateNumber(Math.round(value));
  return `${translatedNumber}%`;
};

// Translate currency values
export const translateCurrency = (amount: number): string => {
  const translatedNumber = translateNumber(amount);
  return `₹${translatedNumber}`;
};