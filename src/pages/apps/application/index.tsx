// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import useBotUserStore from 'src/features/botUser/botUser.service'

// ** Demo Components Imports
import AccessKeyCard from 'src/views/apps/application/AccessKeyCard'
import ApiTokenCard from 'src/views/apps/application/ApiTokenCard'

const FormLayouts = () => {
  const botUserStore = useBotUserStore()

  useEffect(() => {
    ; (async () => {
      await botUserStore.getAccessKey()
    })()
  }, [])
  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <AccessKeyCard />
        </Grid>

        <Grid item xs={12} md={6}>
          <ApiTokenCard />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default FormLayouts
