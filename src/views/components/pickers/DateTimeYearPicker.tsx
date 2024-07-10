// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import CardSnippet from 'src/@core/components/card-snippet'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import PickersTime from 'src/views/forms/form-elements/pickers/PickersTime'
import PickersBasic from 'src/views/forms/form-elements/pickers/PickersBasic'
import PickersRange from 'src/views/forms/form-elements/pickers/PickersRange'
import PickersMinMax from 'src/views/forms/form-elements/pickers/PickersMinMax'
import PickersLocale from 'src/views/forms/form-elements/pickers/PickersLocale'
import PickersOptions from 'src/views/forms/form-elements/pickers/PickersOptions'
import PickersCallbacks from 'src/views/forms/form-elements/pickers/PickersCallbacks'
import PickersSpecificRange from 'src/views/forms/form-elements/pickers/PickersSpecificRange'
import PickersCustomization from 'src/views/forms/form-elements/pickers/PickersCustomization'
import PickersIncludeExclude from 'src/views/forms/form-elements/pickers/PickersIncludeExclude'
import PickersMonthYearQuarter from 'src/views/forms/form-elements/pickers/PickersMonthYearQuarter'
import PickersMonthYearDropdowns from 'src/views/forms/form-elements/pickers/PickersMonthYearDropdowns'

// ** Source code imports
import * as source from 'src/views/forms/form-elements/pickers/PickersSourceCode'

const DateTimeYearPicker = ({
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
        showTimeSelect
        // selected={new Date(value)}
        selected={monthYear}
        // id='month-year-dropdown'
        dateFormat='yyyy-MM-dd HH:mm:ss'
        timeFormat='HH:mm'
        placeholderText='MM-DD-YYYY'
        value={value}
        // popperPlacement={popperPlacement}
        onChange={(date, e) => {
          setMonthYear(date)
          onChange(date, e)
        }}
        customInput={<CustomInput label={label} style={{ width: '100%' }} />}
        showTimeInput
      />
    </DatePickerWrapper>
  )
}

export default DateTimeYearPicker
