// ** React Imports
import { useState } from 'react'

// ** Next Import

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

interface State {
  password: string
  showPassword: boolean
}

const AccessKeyCard = () => {
  // ** States

  const { accessKey, secretKey, ...botStore } = useBotUserStore()

  const [cipboard, setClipBoard] = useState<Array<string>>([])

  const Copy = (type: 'accessKey' | 'secretKey') => async () => {
    await clipboardCopy(eval(type))
    setClipBoard(prev => [...new Set([...prev, type])])
  }

  const generate = async () => {
    await botStore.generateAccessKey()
  }

  return (
    <Card>
      <CardHeader title='App : Cricket' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <InputLabel htmlFor='form-layouts-basic-accessKey'>Access key</InputLabel>
              <FormControl fullWidth>

                <OutlinedInput

                  defaultValue={'  '}
                  value={accessKey}
                  disabled
                  type={'text'}
                  id='form-layouts-basic-accessKey'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={Copy('accessKey')}
                        color={cipboard.includes('accessKey') ? 'success' : 'default'}
                      >
                        <Icon icon={cipboard.includes('accessKey') ? 'mdi:check-circle' : 'mdi:content-copy'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id='form-layouts-basic-password-accessKey'></FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor='form-layouts-basic-secretKey'>Secret key</InputLabel>
              <FormControl fullWidth>

                <OutlinedInput

                  defaultValue={''}
                  value={secretKey}
                  disabled
                  type={'text'}
                  id='form-layouts-basic-secretKey'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={Copy('secretKey')}
                        color={cipboard.includes('secretKey') ? 'success' : 'default'}
                      >
                        <Icon icon={cipboard.includes('secretKey') ? 'mdi:check-circle' : 'mdi:content-copy'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id='form-layouts-basic-password-secretKey'></FormHelperText>
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
                  Generate Access Key
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccessKeyCard
