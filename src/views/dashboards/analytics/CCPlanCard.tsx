// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


// interface CCPlan {
//   plans: string
//   amount: string
//   start_at: string
//   end_at: string
// }

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { useRouter } from 'next/router'
import moment from 'moment'

// ** Component Import

const CCPlanCard = (data: any) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>('yes')
  const [plan, setPlan] = useState<'monthly' | 'annually'>('annually')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  // const [openPricingDialog, setOpenPricingDialog] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<{ checked: boolean }>) => {
    if (e.target.checked) {
      setPlan('annually')
    } else {
      setPlan('monthly')
    }
  }

  const handleClose = () => setOpen(false)

  const router = useRouter();

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }


  const start = data?.plan_status?.start || 0;
  const end = data?.plan_status?.end || 100;
  const current = data?.plan_status?.current || 0;

  // Calculate the progress percentage
  const progress = ((current - start) / (end - start)) * 100;

  return (
    <>

      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 6 }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Your Current Plan is <CustomChip label={data?.plans} size='small' color='primary' skin='light' /></Typography>
              <Typography sx={{ color: 'text.secondary' }}>A simple start for everyone</Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Active until {moment.unix(data?.end_at).format('MMMM D, YYYY')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                We will send you a notification upon Subscription expiration
              </Typography>
            </Box>
            <div>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: .75 } }}>
                  <Icon icon='mdi:currency-rupee' fontSize={16} />

                </Box>
                <Typography sx={{ mr: 2, fontWeight: 600, textTransform: 'capitalize' }}>{data?.amount} Per {data?.period}</Typography>
                <CustomChip label='Popular' size='small' color='primary' skin='light' />

              </Box>
              <Typography sx={{ color: 'text.secondary' }}>{data?.matches_access}</Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <Alert
                severity='warning'
                sx={{ mb: 6 }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close'>
                    <Icon icon='mdi:close' fontSize='inherit' />
                  </IconButton>
                }
              >
                {/* <AlertTitle>We need your attention!</AlertTitle>
                Your plan requires update
              </Alert> */}

            <div>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>{data?.plan_status?.name}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{current} of {end} {data?.plan_status?.name}</Typography>
              </Box>
              <LinearProgress
                value={progress}
                variant='determinate'
                sx={{ my: 1.5, height: 8, borderRadius: 6, '& .MuiLinearProgress-bar': { borderRadius: 6 } }}
              />
              <Typography variant='caption'>{data?.plan_status?.remaining} {data?.plan_status?.name} remaining until your plan requires update</Typography>
            </div>
            <Box sx={{ mt: 7, gap: 4, display: 'flex', flexWrap: 'wrap' }}>
              <Button variant='contained' onClick={() => {
                // setOpenPricingDialog(true)
                router.replace('/apps/plans/list/')
              }}>
                Upgrade Plan
              </Button>
              {/* <Button variant='outlined' color='secondary' onClick={() => setOpen(true)}>
                  Cancel Subscription
                </Button> */}
            </Box>
          </Grid>

        </Grid>
      </CardContent>


      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
            <Typography>Are you sure you would like to cancel your subscription?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Unsubscribed!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
        fullWidth
        scroll='body'
        maxWidth='lg'
        open={openPricingDialog}
        onClose={() => setOpenPricingDialog(false)}
        onBackdropClick={() => setOpenPricingDialog(false)}
      >
        <DialogContent
          sx={{
            position: 'relative',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setOpenPricingDialog(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Find the right plan for your site
            </Typography>
            <Typography variant='body2'>
              Get started with us - it's perfect for individuals and teams. Choose a subscription plan that meets your
              needs.
            </Typography>
          </Box>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <InputLabel
              htmlFor='modal-pricing-switch'
              sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
            >
              Monthly
            </InputLabel>
            <Switch onChange={handleChange} id='modal-pricing-switch' checked={plan === 'annually'} />
            <InputLabel
              htmlFor='modal-pricing-switch'
              sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
            >
              Annually
            </InputLabel>
          </Box>
          <PricingPlans data={data} plan={plan} />
        </DialogContent>
      </Dialog> */}
    </>
  )
}

export default CCPlanCard
