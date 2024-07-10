// ** MUI Imports
import { CardContent, Grid, GridProps, styled } from '@mui/material';
import Card from '@mui/material/Card';

// Styled Grid component
const StyledGrid2 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '0 !important'
  },
  [theme.breakpoints.down('md')]: {
    order: -1
  }
}))
// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  height: '11rem',
  borderRadius: theme.shape.borderRadius
}))

const QrcodeCard = () => {
  return (
    <Card>
      <StyledGrid2 item xs={12} md={12} lg={12}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Img alt='Stumptown Roasters' src='/images/payments/qr.png' />
        </CardContent>
      </StyledGrid2>

    </Card>
  )
}

export default QrcodeCard
