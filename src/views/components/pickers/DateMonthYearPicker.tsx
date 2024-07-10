// ** Third Party Imports
import DatePicker from 'react-datepicker';
import { useState } from "react";
// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from "src/types/forms/reactDatepickerTypes";
// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

const DateMonthYearPicker = ({
  label,
  value,
  onChange
}: {
  label?: string
  value: any
  onChange(date: any, event: React.SyntheticEvent<any> | undefined): void
}) => {
  // ** States
  const [monthYear, setMonthYear] = useState<DateType>(new Date())

  return (
    <DatePickerWrapper>
      <DatePicker
        showYearDropdown
        showMonthDropdown

        // selected={new Date(value)}
        selected={monthYear}
        // id='month-year-dropdown'
        dateFormat='yyyy-MM-dd'

        placeholderText='MM-DD-YYYY'
        value={value}
        // popperPlacement={popperPlacement}
        onChange={(date: any, e: any) => {
          setMonthYear(date)
          onChange(date, e)
        }}
        customInput={<CustomInput label={label} style={{ width: '100%' }} />}
      />
    </DatePickerWrapper>
  )
}

export default DateMonthYearPicker
