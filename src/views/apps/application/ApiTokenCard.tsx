// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import useBotUserStore from 'src/features/botUser/botUser.service'
import clipboardCopy from 'clipboard-copy'


const ApiTokenCard = () => {
  // ** States
  const { apiToken: token, accessKey, secretKey, ...botStore } = useBotUserStore()

  const [cipboard, setClipBoard] = useState<Array<string>>([])

  const Copy = (type: 'token') => async () => {
    await clipboardCopy(eval(type))
    setClipBoard(prev => [...new Set([...prev, type])])
  }

  const generate = async () => {
    await botStore.generateApiToken({
      access_key: accessKey,
      secret_key: secretKey,
      extend: true
    })
  }

  return (
    <Card>
      <CardHeader title='App : CRICKET' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>

          <Grid container spacing={5}>
            <Grid item xs={12}>
              <InputLabel htmlFor='form-layouts-basic-token'>Token</InputLabel>
              <FormControl fullWidth>

                <OutlinedInput
                  label=''
                  defaultValue={'  '}
                  value={token}
                  disabled
                  type={'text'}
                  id='form-layouts-basic-accessKey'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={Copy('token')}
                        color={cipboard.includes('token') ? 'success' : 'default'}
                      >
                        <Icon icon={cipboard.includes('token') ? 'mdi:check-circle' : 'mdi:content-copy'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id='form-layouts-basic-password-accessKey'></FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button variant='contained' size='medium' onClick={generate}>
                  Generate Token
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ApiTokenCard














