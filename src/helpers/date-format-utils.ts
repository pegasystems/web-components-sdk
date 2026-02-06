import { getLocale } from './formatters/common';

export const dateFormatInfoDefault = {
  dateFormatString: 'MM/DD/YYYY',
  dateFormatStringLong: 'MMM DD, YYYY',
  dateFormatStringLC: 'mm/dd/yyyy',
  dateFormatMask: '__/__/____'
};

export const getDateFormatInfo = () => {
  const theDateFormatInfo = { ...dateFormatInfoDefault };
  const theLocale = getLocale();
  const localizedVal = PCore?.getLocaleUtils?.()?.getLocaleValue;
  const localeCategory = 'CosmosFields';

  const theTestDate = new Date(Date.parse('30 November 2023 12:00:00 GMT'));
  const theTestDateLocaleString = new Intl.DateTimeFormat(theLocale).format(theTestDate);

  const locMM = theTestDateLocaleString.indexOf('11');
  const locDD = theTestDateLocaleString.indexOf('30');
  const locYYYY = theTestDateLocaleString.indexOf('2023');

  // If localized placeholder exists for one of day/month/year then show it otherwise fall back to ddmmyyyy
  const hasPegaPlaceholders =
    localizedVal &&
    (localizedVal('month_placeholder', localeCategory) !== 'month_placeholder' ||
      localizedVal('day_placeholder', localeCategory) !== 'day_placeholder' ||
      localizedVal('year_placeholder', localeCategory) !== 'year_placeholder');

  const getSeparator = (index, length) => {
    if (index + length < theTestDateLocaleString.length) {
      const char = theTestDateLocaleString[index + length];
      return Number.isNaN(parseInt(char, 10)) ? char : '';
    }
    return '';
  };

  const arrPieces = [
    {
      loc: locMM,
      format: 'MM',
      longFormat: 'MMM',
      placeholder: hasPegaPlaceholders ? localizedVal('month_placeholder', localeCategory) : 'mm',
      mask: '__',
      separator: getSeparator(locMM, 2)
    },
    {
      loc: locDD,
      format: 'DD',
      longFormat: 'DD',
      placeholder: hasPegaPlaceholders ? localizedVal('day_placeholder', localeCategory) : 'dd',
      mask: '__',
      separator: getSeparator(locDD, 2)
    },
    {
      loc: locYYYY,
      format: 'YYYY',
      longFormat: 'YYYY',
      placeholder: hasPegaPlaceholders ? localizedVal('year_placeholder', localeCategory) : 'yyyy',
      mask: '____',
      separator: getSeparator(locYYYY, 4)
    }
  ];

  arrPieces.sort((a, b) => a.loc - b.loc);

  theDateFormatInfo.dateFormatString = `${arrPieces[0].format}${arrPieces[0].separator}${arrPieces[1].format}${arrPieces[1].separator}${arrPieces[2].format}`;

  theDateFormatInfo.dateFormatStringLong = `${arrPieces[0].longFormat} ${arrPieces[1].longFormat}, ${arrPieces[2].longFormat}`;

  theDateFormatInfo.dateFormatStringLC = `${arrPieces[0].placeholder}${arrPieces[0].separator}${arrPieces[1].placeholder}${arrPieces[1].separator}${arrPieces[2].placeholder}`;

  theDateFormatInfo.dateFormatMask = `${arrPieces[0].mask}${arrPieces[0].separator}${arrPieces[1].mask}${arrPieces[1].separator}${arrPieces[2].mask}`;

  return theDateFormatInfo;
};
