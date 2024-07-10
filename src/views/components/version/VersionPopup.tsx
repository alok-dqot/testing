// ** React Imports
import { forwardRef, Fragment, ReactElement, Ref, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide, { SlideProps } from '@mui/material/Slide'
import DialogContentText from '@mui/material/DialogContentText'
import { Alert, AlertTitle, Typography } from '@mui/material'
import useVersionStore from 'src/features/version/version.service'
import { useAuth } from 'src/hooks/useAuth'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const VersionPopup = () => {
  // ** State

  const [open, setOpen] = useState<boolean>(true)

  const handleClose = () => setOpen(false)

  const versionStore = useVersionStore()
  const auth = useAuth()
  if (!auth.user) {
    return <></>
  }

  useEffect(() => {
    versionStore.clearStorage()
  }, [])

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth='lg'
        open={versionStore?.latest > versionStore?.current}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          <Alert severity='info'>
            {/* <AlertTitle>Info</AlertTitle> */}
            <strong>New Update v{versionStore?.latest}</strong>
          </Alert>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ fontSize: 18 }}>
            <pre style={{ margin: 0 }}>{versionStore?.message || 'new version available'}</pre>
          </Typography>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={versionStore?.addVersion} variant='contained'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default VersionPopup
