"use strict";
exports.id = "vendor-chunks/date-fns";
exports.ids = ["vendor-chunks/date-fns"];
exports.modules = {

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/defaultOptions.js":
/*!********************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/defaultOptions.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultOptions: () => (/* binding */ getDefaultOptions),
/* harmony export */   setDefaultOptions: () => (/* binding */ setDefaultOptions)
/* harmony export */ });
let defaultOptions = {};
function getDefaultOptions() {
    return defaultOptions;
}
function setDefaultOptions(newOptions) {
    defaultOptions = newOptions;
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/getRoundingMethod.js":
/*!***********************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/getRoundingMethod.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRoundingMethod: () => (/* binding */ getRoundingMethod)
/* harmony export */ });
function getRoundingMethod(method) {
    return (number)=>{
        const round = method ? Math[method] : Math.trunc;
        const result = round(number);
        // Prevent negative zero
        return result === 0 ? 0 : result;
    };
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js":
/*!*************************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTimezoneOffsetInMilliseconds: () => (/* binding */ getTimezoneOffsetInMilliseconds)
/* harmony export */ });
/* harmony import */ var _toDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../toDate.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js");

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */ function getTimezoneOffsetInMilliseconds(date) {
    const _date = (0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
    const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/normalizeDates.js":
/*!********************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/normalizeDates.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeDates: () => (/* binding */ normalizeDates)
/* harmony export */ });
/* harmony import */ var _constructFrom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constructFrom.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructFrom.js");

function normalizeDates(context, ...dates) {
    const normalize = _constructFrom_js__WEBPACK_IMPORTED_MODULE_0__.constructFrom.bind(null, context || dates.find((date)=>typeof date === "object"));
    return dates.map(normalize);
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/compareAsc.js":
/*!***********************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/compareAsc.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareAsc: () => (/* binding */ compareAsc),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js");

/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */ function compareAsc(dateLeft, dateRight) {
    const diff = +(0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateLeft) - +(0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateRight);
    if (diff < 0) return -1;
    else if (diff > 0) return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
    return diff;
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (compareAsc);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constants.js":
/*!**********************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constants.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   constructFromSymbol: () => (/* binding */ constructFromSymbol),
/* harmony export */   daysInWeek: () => (/* binding */ daysInWeek),
/* harmony export */   daysInYear: () => (/* binding */ daysInYear),
/* harmony export */   maxTime: () => (/* binding */ maxTime),
/* harmony export */   millisecondsInDay: () => (/* binding */ millisecondsInDay),
/* harmony export */   millisecondsInHour: () => (/* binding */ millisecondsInHour),
/* harmony export */   millisecondsInMinute: () => (/* binding */ millisecondsInMinute),
/* harmony export */   millisecondsInSecond: () => (/* binding */ millisecondsInSecond),
/* harmony export */   millisecondsInWeek: () => (/* binding */ millisecondsInWeek),
/* harmony export */   minTime: () => (/* binding */ minTime),
/* harmony export */   minutesInDay: () => (/* binding */ minutesInDay),
/* harmony export */   minutesInHour: () => (/* binding */ minutesInHour),
/* harmony export */   minutesInMonth: () => (/* binding */ minutesInMonth),
/* harmony export */   minutesInYear: () => (/* binding */ minutesInYear),
/* harmony export */   monthsInQuarter: () => (/* binding */ monthsInQuarter),
/* harmony export */   monthsInYear: () => (/* binding */ monthsInYear),
/* harmony export */   quartersInYear: () => (/* binding */ quartersInYear),
/* harmony export */   secondsInDay: () => (/* binding */ secondsInDay),
/* harmony export */   secondsInHour: () => (/* binding */ secondsInHour),
/* harmony export */   secondsInMinute: () => (/* binding */ secondsInMinute),
/* harmony export */   secondsInMonth: () => (/* binding */ secondsInMonth),
/* harmony export */   secondsInQuarter: () => (/* binding */ secondsInQuarter),
/* harmony export */   secondsInWeek: () => (/* binding */ secondsInWeek),
/* harmony export */   secondsInYear: () => (/* binding */ secondsInYear)
/* harmony export */ });
/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */ /**
 * @constant
 * @name daysInWeek
 * @summary Days in 1 week.
 */ const daysInWeek = 7;
/**
 * @constant
 * @name daysInYear
 * @summary Days in 1 year.
 *
 * @description
 * How many days in a year.
 *
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occurs every 4 years, except for years that are divisible by 100 and not divisible by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 */ const daysInYear = 365.2425;
/**
 * @constant
 * @name maxTime
 * @summary Maximum allowed time.
 *
 * @example
 * import { maxTime } from "./constants/date-fns/constants";
 *
 * const isValid = 8640000000000001 <= maxTime;
 * //=> false
 *
 * new Date(8640000000000001);
 * //=> Invalid Date
 */ const maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;
/**
 * @constant
 * @name minTime
 * @summary Minimum allowed time.
 *
 * @example
 * import { minTime } from "./constants/date-fns/constants";
 *
 * const isValid = -8640000000000001 >= minTime;
 * //=> false
 *
 * new Date(-8640000000000001)
 * //=> Invalid Date
 */ const minTime = -maxTime;
/**
 * @constant
 * @name millisecondsInWeek
 * @summary Milliseconds in 1 week.
 */ const millisecondsInWeek = 604800000;
/**
 * @constant
 * @name millisecondsInDay
 * @summary Milliseconds in 1 day.
 */ const millisecondsInDay = 86400000;
/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */ const millisecondsInMinute = 60000;
/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */ const millisecondsInHour = 3600000;
/**
 * @constant
 * @name millisecondsInSecond
 * @summary Milliseconds in 1 second
 */ const millisecondsInSecond = 1000;
/**
 * @constant
 * @name minutesInYear
 * @summary Minutes in 1 year.
 */ const minutesInYear = 525600;
/**
 * @constant
 * @name minutesInMonth
 * @summary Minutes in 1 month.
 */ const minutesInMonth = 43200;
/**
 * @constant
 * @name minutesInDay
 * @summary Minutes in 1 day.
 */ const minutesInDay = 1440;
/**
 * @constant
 * @name minutesInHour
 * @summary Minutes in 1 hour.
 */ const minutesInHour = 60;
/**
 * @constant
 * @name monthsInQuarter
 * @summary Months in 1 quarter.
 */ const monthsInQuarter = 3;
/**
 * @constant
 * @name monthsInYear
 * @summary Months in 1 year.
 */ const monthsInYear = 12;
/**
 * @constant
 * @name quartersInYear
 * @summary Quarters in 1 year
 */ const quartersInYear = 4;
/**
 * @constant
 * @name secondsInHour
 * @summary Seconds in 1 hour.
 */ const secondsInHour = 3600;
/**
 * @constant
 * @name secondsInMinute
 * @summary Seconds in 1 minute.
 */ const secondsInMinute = 60;
/**
 * @constant
 * @name secondsInDay
 * @summary Seconds in 1 day.
 */ const secondsInDay = secondsInHour * 24;
/**
 * @constant
 * @name secondsInWeek
 * @summary Seconds in 1 week.
 */ const secondsInWeek = secondsInDay * 7;
/**
 * @constant
 * @name secondsInYear
 * @summary Seconds in 1 year.
 */ const secondsInYear = secondsInDay * daysInYear;
/**
 * @constant
 * @name secondsInMonth
 * @summary Seconds in 1 month
 */ const secondsInMonth = secondsInYear / 12;
/**
 * @constant
 * @name secondsInQuarter
 * @summary Seconds in 1 quarter.
 */ const secondsInQuarter = secondsInMonth * 3;
/**
 * @constant
 * @name constructFromSymbol
 * @summary Symbol enabling Date extensions to inherit properties from the reference date.
 *
 * The symbol is used to enable the `constructFrom` function to construct a date
 * using a reference date and a value. It allows to transfer extra properties
 * from the reference date to the new date. It's useful for extensions like
 * [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
 * a constructor argument.
 */ const constructFromSymbol = Symbol.for("constructDateFrom");


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructFrom.js":
/*!**************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructFrom.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   constructFrom: () => (/* binding */ constructFrom),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constants.js");

/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from "./constructFrom/date-fns";
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date>(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use constructor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   );
 * }
 */ function constructFrom(date, value) {
    if (typeof date === "function") return date(value);
    if (date && typeof date === "object" && _constants_js__WEBPACK_IMPORTED_MODULE_0__.constructFromSymbol in date) return date[_constants_js__WEBPACK_IMPORTED_MODULE_0__.constructFromSymbol](value);
    if (date instanceof Date) return new date.constructor(value);
    return new Date(value);
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (constructFrom);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructNow.js":
/*!*************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructNow.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   constructNow: () => (/* binding */ constructNow),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constructFrom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constructFrom.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructFrom.js");

/**
 * @name constructNow
 * @category Generic Helpers
 * @summary Constructs a new current date using the passed value constructor.
 * @pure false
 *
 * @description
 * The function constructs a new current date using the constructor from
 * the reference date. It helps to build generic functions that accept date
 * extensions and use the current date.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @param date - The reference date to take constructor from
 *
 * @returns Current date initialized using the given date constructor
 *
 * @example
 * import { constructNow, isSameDay } from 'date-fns'
 *
 * function isToday<DateType extends Date>(
 *   date: DateArg<DateType>,
 * ): boolean {
 *   // If we were to use `new Date()` directly, the function would  behave
 *   // differently in different timezones and return false for the same date.
 *   return isSameDay(date, constructNow(date));
 * }
 */ function constructNow(date) {
    return (0,_constructFrom_js__WEBPACK_IMPORTED_MODULE_0__.constructFrom)(date, Date.now());
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (constructNow);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInCalendarMonths.js":
/*!***************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInCalendarMonths.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInCalendarMonths: () => (/* binding */ differenceInCalendarMonths)
/* harmony export */ });
/* harmony import */ var _lib_normalizeDates_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_lib/normalizeDates.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/normalizeDates.js");

/**
 * The {@link differenceInCalendarMonths} function options.
 */ /**
 * @name differenceInCalendarMonths
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of calendar months
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */ function differenceInCalendarMonths(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = (0,_lib_normalizeDates_js__WEBPACK_IMPORTED_MODULE_0__.normalizeDates)(options?.in, laterDate, earlierDate);
    const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
    const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
    return yearsDiff * 12 + monthsDiff;
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInCalendarMonths);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInMilliseconds.js":
/*!*************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInMilliseconds.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInMilliseconds: () => (/* binding */ differenceInMilliseconds)
/* harmony export */ });
/* harmony import */ var _toDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js");

/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 *
 * @returns The number of milliseconds
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */ function differenceInMilliseconds(laterDate, earlierDate) {
    return +(0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(laterDate) - +(0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(earlierDate);
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInMilliseconds);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInMonths.js":
/*!*******************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInMonths.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInMonths: () => (/* binding */ differenceInMonths)
/* harmony export */ });
/* harmony import */ var _lib_normalizeDates_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_lib/normalizeDates.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/normalizeDates.js");
/* harmony import */ var _compareAsc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compareAsc.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/compareAsc.js");
/* harmony import */ var _differenceInCalendarMonths_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./differenceInCalendarMonths.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInCalendarMonths.js");
/* harmony import */ var _isLastDayOfMonth_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLastDayOfMonth.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/isLastDayOfMonth.js");




/**
 * The {@link differenceInMonths} function options.
 */ /**
 * @name differenceInMonths
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of full months
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
 * //=> 7
 */ function differenceInMonths(laterDate, earlierDate, options) {
    const [laterDate_, workingLaterDate, earlierDate_] = (0,_lib_normalizeDates_js__WEBPACK_IMPORTED_MODULE_0__.normalizeDates)(options?.in, laterDate, laterDate, earlierDate);
    const sign = (0,_compareAsc_js__WEBPACK_IMPORTED_MODULE_1__.compareAsc)(workingLaterDate, earlierDate_);
    const difference = Math.abs((0,_differenceInCalendarMonths_js__WEBPACK_IMPORTED_MODULE_2__.differenceInCalendarMonths)(workingLaterDate, earlierDate_));
    if (difference < 1) return 0;
    if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27) workingLaterDate.setDate(30);
    workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);
    let isLastMonthNotFull = (0,_compareAsc_js__WEBPACK_IMPORTED_MODULE_1__.compareAsc)(workingLaterDate, earlierDate_) === -sign;
    if ((0,_isLastDayOfMonth_js__WEBPACK_IMPORTED_MODULE_3__.isLastDayOfMonth)(laterDate_) && difference === 1 && (0,_compareAsc_js__WEBPACK_IMPORTED_MODULE_1__.compareAsc)(laterDate_, earlierDate_) === 1) {
        isLastMonthNotFull = false;
    }
    const result = sign * (difference - +isLastMonthNotFull);
    return result === 0 ? 0 : result;
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInMonths);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInSeconds.js":
/*!********************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInSeconds.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInSeconds: () => (/* binding */ differenceInSeconds)
/* harmony export */ });
/* harmony import */ var _lib_getRoundingMethod_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_lib/getRoundingMethod.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/getRoundingMethod.js");
/* harmony import */ var _differenceInMilliseconds_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./differenceInMilliseconds.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInMilliseconds.js");


/**
 * The {@link differenceInSeconds} function options.
 */ /**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of seconds
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */ function differenceInSeconds(laterDate, earlierDate, options) {
    const diff = (0,_differenceInMilliseconds_js__WEBPACK_IMPORTED_MODULE_0__.differenceInMilliseconds)(laterDate, earlierDate) / 1000;
    return (0,_lib_getRoundingMethod_js__WEBPACK_IMPORTED_MODULE_1__.getRoundingMethod)(options?.roundingMethod)(diff);
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInSeconds);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/endOfDay.js":
/*!*********************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/endOfDay.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   endOfDay: () => (/* binding */ endOfDay)
/* harmony export */ });
/* harmony import */ var _toDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js");

/**
 * The {@link endOfDay} function options.
 */ /**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a day
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */ function endOfDay(date, options) {
    const _date = (0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(date, options?.in);
    _date.setHours(23, 59, 59, 999);
    return _date;
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (endOfDay);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/endOfMonth.js":
/*!***********************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/endOfMonth.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   endOfMonth: () => (/* binding */ endOfMonth)
/* harmony export */ });
/* harmony import */ var _toDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js");

/**
 * The {@link endOfMonth} function options.
 */ /**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a month
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */ function endOfMonth(date, options) {
    const _date = (0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(date, options?.in);
    const month = _date.getMonth();
    _date.setFullYear(_date.getFullYear(), month + 1, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (endOfMonth);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/formatDistance.js":
/*!***************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/formatDistance.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   formatDistance: () => (/* binding */ formatDistance)
/* harmony export */ });
/* harmony import */ var _lib_defaultLocale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_lib/defaultLocale.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US.js");
/* harmony import */ var _lib_defaultOptions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_lib/defaultOptions.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/defaultOptions.js");
/* harmony import */ var _lib_getTimezoneOffsetInMilliseconds_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_lib/getTimezoneOffsetInMilliseconds.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js");
/* harmony import */ var _lib_normalizeDates_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_lib/normalizeDates.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/_lib/normalizeDates.js");
/* harmony import */ var _compareAsc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./compareAsc.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/compareAsc.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constants.js");
/* harmony import */ var _differenceInMonths_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./differenceInMonths.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInMonths.js");
/* harmony import */ var _differenceInSeconds_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./differenceInSeconds.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/differenceInSeconds.js");








/**
 * The {@link formatDistance} function options.
 */ /**
 * @name formatDistance
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words.
 *
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance between dates | Result               |
 * |------------------------|----------------------|
 * | 0 secs ... 5 secs      | less than 5 seconds  |
 * | 5 secs ... 10 secs     | less than 10 seconds |
 * | 10 secs ... 20 secs    | less than 20 seconds |
 * | 20 secs ... 40 secs    | half a minute        |
 * | 40 secs ... 60 secs    | less than a minute   |
 * | 60 secs ... 90 secs    | 1 minute             |
 *
 * @param laterDate - The date
 * @param earlierDate - The date to compare with
 * @param options - An object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00, including seconds?
 * const result = formatDistance(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 *   { includeSeconds: true }
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
 *   addSuffix: true
 * })
 * //=> 'about 1 year ago'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
 *   locale: eoLocale
 * })
 * //=> 'pli ol 1 jaro'
 */ function formatDistance(laterDate, earlierDate, options) {
    const defaultOptions = (0,_lib_defaultOptions_js__WEBPACK_IMPORTED_MODULE_0__.getDefaultOptions)();
    const locale = options?.locale ?? defaultOptions.locale ?? _lib_defaultLocale_js__WEBPACK_IMPORTED_MODULE_1__.enUS;
    const minutesInAlmostTwoDays = 2520;
    const comparison = (0,_compareAsc_js__WEBPACK_IMPORTED_MODULE_2__.compareAsc)(laterDate, earlierDate);
    if (isNaN(comparison)) throw new RangeError("Invalid time value");
    const localizeOptions = Object.assign({}, options, {
        addSuffix: options?.addSuffix,
        comparison: comparison
    });
    const [laterDate_, earlierDate_] = (0,_lib_normalizeDates_js__WEBPACK_IMPORTED_MODULE_3__.normalizeDates)(options?.in, ...comparison > 0 ? [
        earlierDate,
        laterDate
    ] : [
        laterDate,
        earlierDate
    ]);
    const seconds = (0,_differenceInSeconds_js__WEBPACK_IMPORTED_MODULE_4__.differenceInSeconds)(earlierDate_, laterDate_);
    const offsetInSeconds = ((0,_lib_getTimezoneOffsetInMilliseconds_js__WEBPACK_IMPORTED_MODULE_5__.getTimezoneOffsetInMilliseconds)(earlierDate_) - (0,_lib_getTimezoneOffsetInMilliseconds_js__WEBPACK_IMPORTED_MODULE_5__.getTimezoneOffsetInMilliseconds)(laterDate_)) / 1000;
    const minutes = Math.round((seconds - offsetInSeconds) / 60);
    let months;
    // 0 up to 2 mins
    if (minutes < 2) {
        if (options?.includeSeconds) {
            if (seconds < 5) {
                return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
            } else if (seconds < 10) {
                return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
            } else if (seconds < 20) {
                return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
            } else if (seconds < 40) {
                return locale.formatDistance("halfAMinute", 0, localizeOptions);
            } else if (seconds < 60) {
                return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
            } else {
                return locale.formatDistance("xMinutes", 1, localizeOptions);
            }
        } else {
            if (minutes === 0) {
                return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
            } else {
                return locale.formatDistance("xMinutes", minutes, localizeOptions);
            }
        }
    // 2 mins up to 0.75 hrs
    } else if (minutes < 45) {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
    // 0.75 hrs up to 1.5 hrs
    } else if (minutes < 90) {
        return locale.formatDistance("aboutXHours", 1, localizeOptions);
    // 1.5 hrs up to 24 hrs
    } else if (minutes < _constants_js__WEBPACK_IMPORTED_MODULE_6__.minutesInDay) {
        const hours = Math.round(minutes / 60);
        return locale.formatDistance("aboutXHours", hours, localizeOptions);
    // 1 day up to 1.75 days
    } else if (minutes < minutesInAlmostTwoDays) {
        return locale.formatDistance("xDays", 1, localizeOptions);
    // 1.75 days up to 30 days
    } else if (minutes < _constants_js__WEBPACK_IMPORTED_MODULE_6__.minutesInMonth) {
        const days = Math.round(minutes / _constants_js__WEBPACK_IMPORTED_MODULE_6__.minutesInDay);
        return locale.formatDistance("xDays", days, localizeOptions);
    // 1 month up to 2 months
    } else if (minutes < _constants_js__WEBPACK_IMPORTED_MODULE_6__.minutesInMonth * 2) {
        months = Math.round(minutes / _constants_js__WEBPACK_IMPORTED_MODULE_6__.minutesInMonth);
        return locale.formatDistance("aboutXMonths", months, localizeOptions);
    }
    months = (0,_differenceInMonths_js__WEBPACK_IMPORTED_MODULE_7__.differenceInMonths)(earlierDate_, laterDate_);
    // 2 months up to 12 months
    if (months < 12) {
        const nearestMonth = Math.round(minutes / _constants_js__WEBPACK_IMPORTED_MODULE_6__.minutesInMonth);
        return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
    // 1 year up to max Date
    } else {
        const monthsSinceStartOfYear = months % 12;
        const years = Math.trunc(months / 12);
        // N years up to 1 years 3 months
        if (monthsSinceStartOfYear < 3) {
            return locale.formatDistance("aboutXYears", years, localizeOptions);
        // N years 3 months up to N years 9 months
        } else if (monthsSinceStartOfYear < 9) {
            return locale.formatDistance("overXYears", years, localizeOptions);
        // N years 9 months up to N year 12 months
        } else {
            return locale.formatDistance("almostXYears", years + 1, localizeOptions);
        }
    }
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatDistance);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/formatDistanceToNow.js":
/*!********************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/formatDistanceToNow.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   formatDistanceToNow: () => (/* binding */ formatDistanceToNow)
/* harmony export */ });
/* harmony import */ var _constructNow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructNow.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructNow.js");
/* harmony import */ var _formatDistance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatDistance.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/formatDistance.js");


/**
 * The {@link formatDistanceToNow} function options.
 */ /**
 * @name formatDistanceToNow
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 * @pure false
 *
 * @description
 * Return the distance between the given date and now in words.
 *
 * | Distance to now                                                   | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance to now     | Result               |
 * |---------------------|----------------------|
 * | 0 secs ... 5 secs   | less than 5 seconds  |
 * | 5 secs ... 10 secs  | less than 10 seconds |
 * | 10 secs ... 20 secs | less than 20 seconds |
 * | 20 secs ... 40 secs | half a minute        |
 * | 40 secs ... 60 secs | less than a minute   |
 * | 60 secs ... 90 secs | 1 minute             |
 *
 * @param date - The given date
 * @param options - The object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * const result = formatDistanceToNow(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * const result = formatDistanceToNow(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * const result = formatDistanceToNow(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in about 1 year'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 August 2016 in Esperanto?
 * const eoLocale = require('date-fns/locale/eo')
 * const result = formatDistanceToNow(
 *   new Date(2016, 7, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */ function formatDistanceToNow(date, options) {
    return (0,_formatDistance_js__WEBPACK_IMPORTED_MODULE_0__.formatDistance)(date, (0,_constructNow_js__WEBPACK_IMPORTED_MODULE_1__.constructNow)(date), options);
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatDistanceToNow);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/isLastDayOfMonth.js":
/*!*****************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/isLastDayOfMonth.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   isLastDayOfMonth: () => (/* binding */ isLastDayOfMonth)
/* harmony export */ });
/* harmony import */ var _endOfDay_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./endOfDay.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/endOfDay.js");
/* harmony import */ var _endOfMonth_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./endOfMonth.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/endOfMonth.js");
/* harmony import */ var _toDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js");



/**
 * @name isLastDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @param date - The date to check
 * @param options - An object with options
 *
 * @returns The date is the last day of a month
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * const result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */ function isLastDayOfMonth(date, options) {
    const _date = (0,_toDate_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(date, options?.in);
    return +(0,_endOfDay_js__WEBPACK_IMPORTED_MODULE_1__.endOfDay)(_date, options) === +(0,_endOfMonth_js__WEBPACK_IMPORTED_MODULE_2__.endOfMonth)(_date, options);
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isLastDayOfMonth);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildFormatLongFn.js":
/*!******************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildFormatLongFn.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildFormatLongFn: () => (/* binding */ buildFormatLongFn)
/* harmony export */ });
function buildFormatLongFn(args) {
    return (options = {})=>{
        // TODO: Remove String()
        const width = options.width ? String(options.width) : args.defaultWidth;
        const format = args.formats[width] || args.formats[args.defaultWidth];
        return format;
    };
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildLocalizeFn.js":
/*!****************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildLocalizeFn.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildLocalizeFn: () => (/* binding */ buildLocalizeFn)
/* harmony export */ });
/**
 * The localize function argument callback which allows to convert raw value to
 * the actual type.
 *
 * @param value - The value to convert
 *
 * @returns The converted value
 */ /**
 * The map of localized values for each width.
 */ /**
 * The index type of the locale unit value. It types conversion of units of
 * values that don't start at 0 (i.e. quarters).
 */ /**
 * Converts the unit value to the tuple of values.
 */ /**
 * The tuple of localized era values. The first element represents BC,
 * the second element represents AD.
 */ /**
 * The tuple of localized quarter values. The first element represents Q1.
 */ /**
 * The tuple of localized day values. The first element represents Sunday.
 */ /**
 * The tuple of localized month values. The first element represents January.
 */ function buildLocalizeFn(args) {
    return (value, options)=>{
        const context = options?.context ? String(options.context) : "standalone";
        let valuesArray;
        if (context === "formatting" && args.formattingValues) {
            const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
            const width = options?.width ? String(options.width) : defaultWidth;
            valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
        } else {
            const defaultWidth = args.defaultWidth;
            const width = options?.width ? String(options.width) : args.defaultWidth;
            valuesArray = args.values[width] || args.values[defaultWidth];
        }
        const index = args.argumentCallback ? args.argumentCallback(value) : value;
        // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
        return valuesArray[index];
    };
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchFn.js":
/*!*************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchFn.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildMatchFn: () => (/* binding */ buildMatchFn)
/* harmony export */ });
function buildMatchFn(args) {
    return (string, options = {})=>{
        const width = options.width;
        const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
        const matchResult = string.match(matchPattern);
        if (!matchResult) {
            return null;
        }
        const matchedString = matchResult[0];
        const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
        const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern)=>pattern.test(matchedString)) : findKey(parsePatterns, (pattern)=>pattern.test(matchedString));
        let value;
        value = args.valueCallback ? args.valueCallback(key) : key;
        value = options.valueCallback ? options.valueCallback(value) : value;
        const rest = string.slice(matchedString.length);
        return {
            value,
            rest
        };
    };
}
function findKey(object, predicate) {
    for(const key in object){
        if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
            return key;
        }
    }
    return undefined;
}
function findIndex(array, predicate) {
    for(let key = 0; key < array.length; key++){
        if (predicate(array[key])) {
            return key;
        }
    }
    return undefined;
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js":
/*!********************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildMatchPatternFn: () => (/* binding */ buildMatchPatternFn)
/* harmony export */ });
function buildMatchPatternFn(args) {
    return (string, options = {})=>{
        const matchResult = string.match(args.matchPattern);
        if (!matchResult) return null;
        const matchedString = matchResult[0];
        const parseResult = string.match(args.parsePattern);
        if (!parseResult) return null;
        let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
        // [TODO] I challenge you to fix the type
        value = options.valueCallback ? options.valueCallback(value) : value;
        const rest = string.slice(matchedString.length);
        return {
            value,
            rest
        };
    };
}


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US.js":
/*!*************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   enUS: () => (/* binding */ enUS)
/* harmony export */ });
/* harmony import */ var _en_US_lib_formatDistance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./en-US/_lib/formatDistance.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatDistance.js");
/* harmony import */ var _en_US_lib_formatLong_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./en-US/_lib/formatLong.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatLong.js");
/* harmony import */ var _en_US_lib_formatRelative_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./en-US/_lib/formatRelative.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatRelative.js");
/* harmony import */ var _en_US_lib_localize_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./en-US/_lib/localize.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/localize.js");
/* harmony import */ var _en_US_lib_match_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./en-US/_lib/match.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/match.js");





/**
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
 * @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
 */ const enUS = {
    code: "en-US",
    formatDistance: _en_US_lib_formatDistance_js__WEBPACK_IMPORTED_MODULE_0__.formatDistance,
    formatLong: _en_US_lib_formatLong_js__WEBPACK_IMPORTED_MODULE_1__.formatLong,
    formatRelative: _en_US_lib_formatRelative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelative,
    localize: _en_US_lib_localize_js__WEBPACK_IMPORTED_MODULE_3__.localize,
    match: _en_US_lib_match_js__WEBPACK_IMPORTED_MODULE_4__.match,
    options: {
        weekStartsOn: 0 /* Sunday */ ,
        firstWeekContainsDate: 1
    }
};
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (enUS);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatDistance.js":
/*!*********************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatDistance.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDistance: () => (/* binding */ formatDistance)
/* harmony export */ });
const formatDistanceLocale = {
    lessThanXSeconds: {
        one: "less than a second",
        other: "less than {{count}} seconds"
    },
    xSeconds: {
        one: "1 second",
        other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
        one: "less than a minute",
        other: "less than {{count}} minutes"
    },
    xMinutes: {
        one: "1 minute",
        other: "{{count}} minutes"
    },
    aboutXHours: {
        one: "about 1 hour",
        other: "about {{count}} hours"
    },
    xHours: {
        one: "1 hour",
        other: "{{count}} hours"
    },
    xDays: {
        one: "1 day",
        other: "{{count}} days"
    },
    aboutXWeeks: {
        one: "about 1 week",
        other: "about {{count}} weeks"
    },
    xWeeks: {
        one: "1 week",
        other: "{{count}} weeks"
    },
    aboutXMonths: {
        one: "about 1 month",
        other: "about {{count}} months"
    },
    xMonths: {
        one: "1 month",
        other: "{{count}} months"
    },
    aboutXYears: {
        one: "about 1 year",
        other: "about {{count}} years"
    },
    xYears: {
        one: "1 year",
        other: "{{count}} years"
    },
    overXYears: {
        one: "over 1 year",
        other: "over {{count}} years"
    },
    almostXYears: {
        one: "almost 1 year",
        other: "almost {{count}} years"
    }
};
const formatDistance = (token, count, options)=>{
    let result;
    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
        result = tokenValue;
    } else if (count === 1) {
        result = tokenValue.one;
    } else {
        result = tokenValue.other.replace("{{count}}", count.toString());
    }
    if (options?.addSuffix) {
        if (options.comparison && options.comparison > 0) {
            return "in " + result;
        } else {
            return result + " ago";
        }
    }
    return result;
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatLong.js":
/*!*****************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatLong.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLong: () => (/* binding */ formatLong)
/* harmony export */ });
/* harmony import */ var _lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_lib/buildFormatLongFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildFormatLongFn.js");

const dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
};
const timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
};
const dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
};
const formatLong = {
    date: (0,_lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__.buildFormatLongFn)({
        formats: dateFormats,
        defaultWidth: "full"
    }),
    time: (0,_lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__.buildFormatLongFn)({
        formats: timeFormats,
        defaultWidth: "full"
    }),
    dateTime: (0,_lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__.buildFormatLongFn)({
        formats: dateTimeFormats,
        defaultWidth: "full"
    })
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatRelative.js":
/*!*********************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/formatRelative.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelative: () => (/* binding */ formatRelative)
/* harmony export */ });
const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
};
const formatRelative = (token, _date, _baseDate, _options)=>formatRelativeLocale[token];


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/localize.js":
/*!***************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/localize.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   localize: () => (/* binding */ localize)
/* harmony export */ });
/* harmony import */ var _lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_lib/buildLocalizeFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildLocalizeFn.js");

const eraValues = {
    narrow: [
        "B",
        "A"
    ],
    abbreviated: [
        "BC",
        "AD"
    ],
    wide: [
        "Before Christ",
        "Anno Domini"
    ]
};
const quarterValues = {
    narrow: [
        "1",
        "2",
        "3",
        "4"
    ],
    abbreviated: [
        "Q1",
        "Q2",
        "Q3",
        "Q4"
    ],
    wide: [
        "1st quarter",
        "2nd quarter",
        "3rd quarter",
        "4th quarter"
    ]
};
// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues = {
    narrow: [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D"
    ],
    abbreviated: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    wide: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
};
const dayValues = {
    narrow: [
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S"
    ],
    short: [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa"
    ],
    abbreviated: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ],
    wide: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
};
const dayPeriodValues = {
    narrow: {
        am: "a",
        pm: "p",
        midnight: "mi",
        noon: "n",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    },
    wide: {
        am: "a.m.",
        pm: "p.m.",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    }
};
const formattingDayPeriodValues = {
    narrow: {
        am: "a",
        pm: "p",
        midnight: "mi",
        noon: "n",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "midnight",
        noon: "noon",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
    },
    wide: {
        am: "a.m.",
        pm: "p.m.",
        midnight: "midnight",
        noon: "noon",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
    }
};
const ordinalNumber = (dirtyNumber, _options)=>{
    const number = Number(dirtyNumber);
    // If ordinal numbers depend on context, for example,
    // if they are different for different grammatical genders,
    // use `options.unit`.
    //
    // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
    // 'day', 'hour', 'minute', 'second'.
    const rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
        switch(rem100 % 10){
            case 1:
                return number + "st";
            case 2:
                return number + "nd";
            case 3:
                return number + "rd";
        }
    }
    return number + "th";
};
const localize = {
    ordinalNumber,
    era: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: eraValues,
        defaultWidth: "wide"
    }),
    quarter: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: quarterValues,
        defaultWidth: "wide",
        argumentCallback: (quarter)=>quarter - 1
    }),
    month: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: monthValues,
        defaultWidth: "wide"
    }),
    day: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: dayValues,
        defaultWidth: "wide"
    }),
    dayPeriod: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: dayPeriodValues,
        defaultWidth: "wide",
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: "wide"
    })
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/match.js":
/*!************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/en-US/_lib/match.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   match: () => (/* binding */ match)
/* harmony export */ });
/* harmony import */ var _lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_lib/buildMatchFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchFn.js");
/* harmony import */ var _lib_buildMatchPatternFn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_lib/buildMatchPatternFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js");


const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
    any: [
        /^b/i,
        /^(a|c)/i
    ]
};
const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
    any: [
        /1/i,
        /2/i,
        /3/i,
        /4/i
    ]
};
const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
    narrow: [
        /^j/i,
        /^f/i,
        /^m/i,
        /^a/i,
        /^m/i,
        /^j/i,
        /^j/i,
        /^a/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ],
    any: [
        /^ja/i,
        /^f/i,
        /^mar/i,
        /^ap/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^au/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ]
};
const matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
    narrow: [
        /^s/i,
        /^m/i,
        /^t/i,
        /^w/i,
        /^t/i,
        /^f/i,
        /^s/i
    ],
    any: [
        /^su/i,
        /^m/i,
        /^tu/i,
        /^w/i,
        /^th/i,
        /^f/i,
        /^sa/i
    ]
};
const matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
    any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^mi/i,
        noon: /^no/i,
        morning: /morning/i,
        afternoon: /afternoon/i,
        evening: /evening/i,
        night: /night/i
    }
};
const match = {
    ordinalNumber: (0,_lib_buildMatchPatternFn_js__WEBPACK_IMPORTED_MODULE_0__.buildMatchPatternFn)({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: (value)=>parseInt(value, 10)
    }),
    era: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseEraPatterns,
        defaultParseWidth: "any"
    }),
    quarter: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: "any",
        valueCallback: (index)=>index + 1
    }),
    month: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: "any"
    }),
    day: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPatterns,
        defaultParseWidth: "any"
    }),
    dayPeriod: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: "any",
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: "any"
    })
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr.js":
/*!**********************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fr: () => (/* binding */ fr)
/* harmony export */ });
/* harmony import */ var _fr_lib_formatDistance_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fr/_lib/formatDistance.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatDistance.js");
/* harmony import */ var _fr_lib_formatLong_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fr/_lib/formatLong.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatLong.js");
/* harmony import */ var _fr_lib_formatRelative_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fr/_lib/formatRelative.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatRelative.js");
/* harmony import */ var _fr_lib_localize_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fr/_lib/localize.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/localize.js");
/* harmony import */ var _fr_lib_match_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fr/_lib/match.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/match.js");





/**
 * @category Locales
 * @summary French locale.
 * @language French
 * @iso-639-2 fra
 * @author Jean Dupouy [@izeau](https://github.com/izeau)
 * @author François B [@fbonzon](https://github.com/fbonzon)
 */ const fr = {
    code: "fr",
    formatDistance: _fr_lib_formatDistance_js__WEBPACK_IMPORTED_MODULE_0__.formatDistance,
    formatLong: _fr_lib_formatLong_js__WEBPACK_IMPORTED_MODULE_1__.formatLong,
    formatRelative: _fr_lib_formatRelative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelative,
    localize: _fr_lib_localize_js__WEBPACK_IMPORTED_MODULE_3__.localize,
    match: _fr_lib_match_js__WEBPACK_IMPORTED_MODULE_4__.match,
    options: {
        weekStartsOn: 1 /* Monday */ ,
        firstWeekContainsDate: 4
    }
};
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fr);


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatDistance.js":
/*!******************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatDistance.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDistance: () => (/* binding */ formatDistance)
/* harmony export */ });
const formatDistanceLocale = {
    lessThanXSeconds: {
        one: "moins d’une seconde",
        other: "moins de {{count}} secondes"
    },
    xSeconds: {
        one: "1 seconde",
        other: "{{count}} secondes"
    },
    halfAMinute: "30 secondes",
    lessThanXMinutes: {
        one: "moins d’une minute",
        other: "moins de {{count}} minutes"
    },
    xMinutes: {
        one: "1 minute",
        other: "{{count}} minutes"
    },
    aboutXHours: {
        one: "environ 1 heure",
        other: "environ {{count}} heures"
    },
    xHours: {
        one: "1 heure",
        other: "{{count}} heures"
    },
    xDays: {
        one: "1 jour",
        other: "{{count}} jours"
    },
    aboutXWeeks: {
        one: "environ 1 semaine",
        other: "environ {{count}} semaines"
    },
    xWeeks: {
        one: "1 semaine",
        other: "{{count}} semaines"
    },
    aboutXMonths: {
        one: "environ 1 mois",
        other: "environ {{count}} mois"
    },
    xMonths: {
        one: "1 mois",
        other: "{{count}} mois"
    },
    aboutXYears: {
        one: "environ 1 an",
        other: "environ {{count}} ans"
    },
    xYears: {
        one: "1 an",
        other: "{{count}} ans"
    },
    overXYears: {
        one: "plus d’un an",
        other: "plus de {{count}} ans"
    },
    almostXYears: {
        one: "presqu’un an",
        other: "presque {{count}} ans"
    }
};
const formatDistance = (token, count, options)=>{
    let result;
    const form = formatDistanceLocale[token];
    if (typeof form === "string") {
        result = form;
    } else if (count === 1) {
        result = form.one;
    } else {
        result = form.other.replace("{{count}}", String(count));
    }
    if (options?.addSuffix) {
        if (options.comparison && options.comparison > 0) {
            return "dans " + result;
        } else {
            return "il y a " + result;
        }
    }
    return result;
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatLong.js":
/*!**************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatLong.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLong: () => (/* binding */ formatLong)
/* harmony export */ });
/* harmony import */ var _lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_lib/buildFormatLongFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildFormatLongFn.js");

const dateFormats = {
    full: "EEEE d MMMM y",
    long: "d MMMM y",
    medium: "d MMM y",
    short: "dd/MM/y"
};
const timeFormats = {
    full: "HH:mm:ss zzzz",
    long: "HH:mm:ss z",
    medium: "HH:mm:ss",
    short: "HH:mm"
};
const dateTimeFormats = {
    full: "{{date}} '\xe0' {{time}}",
    long: "{{date}} '\xe0' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
};
const formatLong = {
    date: (0,_lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__.buildFormatLongFn)({
        formats: dateFormats,
        defaultWidth: "full"
    }),
    time: (0,_lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__.buildFormatLongFn)({
        formats: timeFormats,
        defaultWidth: "full"
    }),
    dateTime: (0,_lib_buildFormatLongFn_js__WEBPACK_IMPORTED_MODULE_0__.buildFormatLongFn)({
        formats: dateTimeFormats,
        defaultWidth: "full"
    })
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatRelative.js":
/*!******************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/formatRelative.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelative: () => (/* binding */ formatRelative)
/* harmony export */ });
const formatRelativeLocale = {
    lastWeek: "eeee 'dernier \xe0' p",
    yesterday: "'hier \xe0' p",
    today: "'aujourd’hui \xe0' p",
    tomorrow: "'demain \xe0' p'",
    nextWeek: "eeee 'prochain \xe0' p",
    other: "P"
};
const formatRelative = (token, _date, _baseDate, _options)=>formatRelativeLocale[token];


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/localize.js":
/*!************************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/localize.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   localize: () => (/* binding */ localize)
/* harmony export */ });
/* harmony import */ var _lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_lib/buildLocalizeFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildLocalizeFn.js");

const eraValues = {
    narrow: [
        "av. J.-C",
        "ap. J.-C"
    ],
    abbreviated: [
        "av. J.-C",
        "ap. J.-C"
    ],
    wide: [
        "avant J\xe9sus-Christ",
        "apr\xe8s J\xe9sus-Christ"
    ]
};
const quarterValues = {
    narrow: [
        "T1",
        "T2",
        "T3",
        "T4"
    ],
    abbreviated: [
        "1er trim.",
        "2\xe8me trim.",
        "3\xe8me trim.",
        "4\xe8me trim."
    ],
    wide: [
        "1er trimestre",
        "2\xe8me trimestre",
        "3\xe8me trimestre",
        "4\xe8me trimestre"
    ]
};
const monthValues = {
    narrow: [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D"
    ],
    abbreviated: [
        "janv.",
        "f\xe9vr.",
        "mars",
        "avr.",
        "mai",
        "juin",
        "juil.",
        "ao\xfbt",
        "sept.",
        "oct.",
        "nov.",
        "d\xe9c."
    ],
    wide: [
        "janvier",
        "f\xe9vrier",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "ao\xfbt",
        "septembre",
        "octobre",
        "novembre",
        "d\xe9cembre"
    ]
};
const dayValues = {
    narrow: [
        "D",
        "L",
        "M",
        "M",
        "J",
        "V",
        "S"
    ],
    short: [
        "di",
        "lu",
        "ma",
        "me",
        "je",
        "ve",
        "sa"
    ],
    abbreviated: [
        "dim.",
        "lun.",
        "mar.",
        "mer.",
        "jeu.",
        "ven.",
        "sam."
    ],
    wide: [
        "dimanche",
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi"
    ]
};
const dayPeriodValues = {
    narrow: {
        am: "AM",
        pm: "PM",
        midnight: "minuit",
        noon: "midi",
        morning: "mat.",
        afternoon: "ap.m.",
        evening: "soir",
        night: "mat."
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "minuit",
        noon: "midi",
        morning: "matin",
        afternoon: "apr\xe8s-midi",
        evening: "soir",
        night: "matin"
    },
    wide: {
        am: "AM",
        pm: "PM",
        midnight: "minuit",
        noon: "midi",
        morning: "du matin",
        afternoon: "de l’apr\xe8s-midi",
        evening: "du soir",
        night: "du matin"
    }
};
const ordinalNumber = (dirtyNumber, options)=>{
    const number = Number(dirtyNumber);
    const unit = options?.unit;
    if (number === 0) return "0";
    const feminineUnits = [
        "year",
        "week",
        "hour",
        "minute",
        "second"
    ];
    let suffix;
    if (number === 1) {
        suffix = unit && feminineUnits.includes(unit) ? "\xe8re" : "er";
    } else {
        suffix = "\xe8me";
    }
    return number + suffix;
};
const LONG_MONTHS_TOKENS = [
    "MMM",
    "MMMM"
];
const localize = {
    preprocessor: (date, parts)=>{
        // Replaces the `do` tokens with `d` when used with long month tokens and the day of the month is greater than one.
        // Use case "do MMMM" => 1er août, 29 août
        // see https://github.com/date-fns/date-fns/issues/1391
        if (date.getDate() === 1) return parts;
        const hasLongMonthToken = parts.some((part)=>part.isToken && LONG_MONTHS_TOKENS.includes(part.value));
        if (!hasLongMonthToken) return parts;
        return parts.map((part)=>part.isToken && part.value === "do" ? {
                isToken: true,
                value: "d"
            } : part);
    },
    ordinalNumber,
    era: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: eraValues,
        defaultWidth: "wide"
    }),
    quarter: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: quarterValues,
        defaultWidth: "wide",
        argumentCallback: (quarter)=>quarter - 1
    }),
    month: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: monthValues,
        defaultWidth: "wide"
    }),
    day: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: dayValues,
        defaultWidth: "wide"
    }),
    dayPeriod: (0,_lib_buildLocalizeFn_js__WEBPACK_IMPORTED_MODULE_0__.buildLocalizeFn)({
        values: dayPeriodValues,
        defaultWidth: "wide"
    })
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/match.js":
/*!*********************************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/fr/_lib/match.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   match: () => (/* binding */ match)
/* harmony export */ });
/* harmony import */ var _lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_lib/buildMatchFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchFn.js");
/* harmony import */ var _lib_buildMatchPatternFn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_lib/buildMatchPatternFn.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js");


const matchOrdinalNumberPattern = /^(\d+)(ième|ère|ème|er|e)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
    narrow: /^(av\.J\.C|ap\.J\.C|ap\.J\.-C)/i,
    abbreviated: /^(av\.J\.-C|av\.J-C|apr\.J\.-C|apr\.J-C|ap\.J-C)/i,
    wide: /^(avant Jésus-Christ|après Jésus-Christ)/i
};
const parseEraPatterns = {
    any: [
        /^av/i,
        /^ap/i
    ]
};
const matchQuarterPatterns = {
    narrow: /^T?[1234]/i,
    abbreviated: /^[1234](er|ème|e)? trim\.?/i,
    wide: /^[1234](er|ème|e)? trimestre/i
};
const parseQuarterPatterns = {
    any: [
        /1/i,
        /2/i,
        /3/i,
        /4/i
    ]
};
const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(janv|févr|mars|avr|mai|juin|juill|juil|août|sept|oct|nov|déc)\.?/i,
    wide: /^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i
};
const parseMonthPatterns = {
    narrow: [
        /^j/i,
        /^f/i,
        /^m/i,
        /^a/i,
        /^m/i,
        /^j/i,
        /^j/i,
        /^a/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ],
    any: [
        /^ja/i,
        /^f/i,
        /^mar/i,
        /^av/i,
        /^ma/i,
        /^juin/i,
        /^juil/i,
        /^ao/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ]
};
const matchDayPatterns = {
    narrow: /^[lmjvsd]/i,
    short: /^(di|lu|ma|me|je|ve|sa)/i,
    abbreviated: /^(dim|lun|mar|mer|jeu|ven|sam)\.?/i,
    wide: /^(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)/i
};
const parseDayPatterns = {
    narrow: [
        /^d/i,
        /^l/i,
        /^m/i,
        /^m/i,
        /^j/i,
        /^v/i,
        /^s/i
    ],
    any: [
        /^di/i,
        /^lu/i,
        /^ma/i,
        /^me/i,
        /^je/i,
        /^ve/i,
        /^sa/i
    ]
};
const matchDayPeriodPatterns = {
    narrow: /^(a|p|minuit|midi|mat\.?|ap\.?m\.?|soir|nuit)/i,
    any: /^([ap]\.?\s?m\.?|du matin|de l'après[-\s]midi|du soir|de la nuit)/i
};
const parseDayPeriodPatterns = {
    any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^min/i,
        noon: /^mid/i,
        morning: /mat/i,
        afternoon: /ap/i,
        evening: /soir/i,
        night: /nuit/i
    }
};
const match = {
    ordinalNumber: (0,_lib_buildMatchPatternFn_js__WEBPACK_IMPORTED_MODULE_0__.buildMatchPatternFn)({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: (value)=>parseInt(value)
    }),
    era: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseEraPatterns,
        defaultParseWidth: "any"
    }),
    quarter: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: "any",
        valueCallback: (index)=>index + 1
    }),
    month: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: "any"
    }),
    day: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPatterns,
        defaultParseWidth: "any"
    }),
    dayPeriod: (0,_lib_buildMatchFn_js__WEBPACK_IMPORTED_MODULE_1__.buildMatchFn)({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: "any",
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: "any"
    })
};


/***/ }),

/***/ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js":
/*!*******************************************************************************!*\
  !*** ../../../../opt/hostedapp/node/root/app/node_modules/date-fns/toDate.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _constructFrom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constructFrom.js */ "(ssr)/../../../../opt/hostedapp/node/root/app/node_modules/date-fns/constructFrom.js");

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */ function toDate(argument, context) {
    // [TODO] Get rid of `toDate` or `constructFrom`?
    return (0,_constructFrom_js__WEBPACK_IMPORTED_MODULE_0__.constructFrom)(context || argument, argument);
}
// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toDate);


/***/ })

};
;