// ** React Imports
import { ReactNode, useState } from 'react';

// ** Next Import
import Link from 'next/link';
// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// ** Icon Imports


// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings';

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2';
import { useAuth } from 'src/hooks/useAuth';
import { Grid, FormControl, TextField, Button, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { inputType } from '../components/global/DynamicForm';
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  bottom: 0,
  left: '1.875rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    left: 0
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const UserRegister = () => {


  interface Register {
    name: string

    email: string
    password: string
    confirm_pass: string
    phone: number

  }
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPassword2, setShowPassword2] = useState<boolean>(false)
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration';

  // schemas



  const registerSchema = yup.object().shape({
    name: yup.string()
      .min(3, 'Name must be 3 character length').label("Name")
      .required('Name field is required.'),
    email: yup.string().email('Invalid Email address').required('Email is required!').label('Email').meta({ type: "email" }),
    phone: yup.string().label("Phone No.")
      .min(10, 'Phone must be 10 character length')
      .required('Phone field is required.'),
    password: yup.string().required().label("Password").meta({ type: "password" }),
    confirm_pass: yup.string().label('Confirm password').required().oneOf([yup.ref('password'), null as any], 'Passwords must match').label('Confirm Password').meta({ type: "cnf_password" }),

    // company: yup.string()
    //   .min(3, 'Company must be 3 character length')
    //   .required('Company field is required.'),

    // country_id: yup.number(),
    // state: yup.string().required('State field is required.'),
    // city: yup.string().required('City field is required.'),
  });



  const auth = useAuth()


  const onSubmit = (data: Register) => {

    const { name, email, password, confirm_pass, phone } = data
    auth.signup({
      name, email, password, confirm_pass, phone,
      company: '',
      gst: ''
    })
  }


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });


  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2 image={<TreeIllustration alt='tree' src='/images/pages/tree-2.png' />} />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* <svg
                width={35}
                height={29}
                version='1.1'
                viewBox='0 0 30 23'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
              >
                <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                  <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                    <g id='logo' transform='translate(95.000000, 50.000000)'>
                      <path
                        id='Combined-Shape'
                        fill={theme.palette.primary.main}
                        d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                        transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                        transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                      />
                      <path
                        id='Rectangle'
                        fillOpacity='0.15'
                        fill={theme.palette.common.white}
                        d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                      />
                      <path
                        id='Rectangle'
                        fillOpacity='0.35'
                        fill={theme.palette.common.white}
                        transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                        d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                      />
                    </g>
                  </g>
                </g>
              </svg> */}

              <img src="/smallLogo.png" alt="small logo" style={{ width: '35px', height: '35px', borderRadius: '10% 10%' }} />

              <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Adventure starts here 🚀</TypographyStyled>
              <Typography variant='body2'>Make your app management easy and fun!</Typography>
            </Box>

            {/* <SchemaForm describedSchema={registerSchema.describe()} onSubmit={onSubmit} /> */}
            {/* <form autoComplete='off' onSubmit={onSubmit}> */}
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit as any)}>
              <Grid container spacing={3}>
                {Object.keys(registerSchema.fields).map((fieldName) => {
                  const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                  const isPasswordField = fieldName.toLowerCase().includes('password');
                  const fields = (registerSchema.describe()).fields[fieldName] as yup.SchemaDescription & { meta: any }
                  const type = inputType[fields.type]

                  return (
                    <Grid item xs={12} sm={12} key={fieldName}>
                      <FormControl fullWidth>
                        <Controller
                          name={fieldName as any}
                          control={control}
                          render={({ field }) => (
                            <>

                              {(fields?.meta?.type === 'password') ? (
                                <>

                                  <OutlinedInput

                                    {...field}
                                    id='auth-login-v2-password'
                                    error={Boolean(errors.password)}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                      <InputAdornment position='end'>
                                        <IconButton
                                          edge='end'
                                          onMouseDown={e => e.preventDefault()}
                                          onClick={() => setShowPassword(!showPassword)}
                                        >
                                          <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                  />



                                </>
                              ) : (
                                <>
                                  <TextField
                                    type={type}
                                    {...field}
                                    label={label}
                                    error={!!(errors as any)[fieldName]}
                                    helperText={(errors as any)[fieldName]?.message}
                                  />
                                </>
                              )}
                            </>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  );
                })}
              </Grid>





              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7, mt: 4 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography variant='body2'>
                  <LinkStyled href='/login'>Sign in instead</LinkStyled>
                </Typography>
              </Box>

            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

UserRegister.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

UserRegister.guestGuard = true

export default UserRegister




// const handleChange = (field: keyof Register, value: string | number) => {
//   setRegister((prev: any) => ({ ...prev, [field]: value }));
// };
{/* <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}>or</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box> */}


{/*
              <TextField autoFocus fullWidth sx={{ mb: 4 }} label='Username' placeholder='johndoe' onChange={(e: any) => handleChange('name', e.target.value)} required />
              <TextField fullWidth label='Email' sx={{ mb: 4 }} placeholder='user@email.com' onChange={(e: any) => handleChange('email', e.target.value)} required />
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  id='auth-login-v2-password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e: any) => handleChange('password', e.target.value)}
                />

              </FormControl>

              <FormControl fullWidth sx={{ my: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password'>Confirm Password</InputLabel>
                <OutlinedInput
                  label='Confirm Password'
                  id='auth-login-v2-password'
                  type={showPassword2 ? 'text' : 'password'}
                  required
                  name='confirm_pass'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword2(!showPassword2)}
                      >
                        <Icon icon={showPassword2 ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e: any) => handleChange('confirm_pass', e.target.value)}
                />

                {passwordMatchError && <p style={{ color: 'red' }}>Password and confirm password must match</p>}

              </FormControl>

              <TextField fullWidth label='Phone' sx={{ my: 4 }} placeholder='Phone No.' type='number'
                onChange={(e: any) => handleChange('phone', e.target.value)}
                required
              />
              <FormControlLabel
                control={<Checkbox />}
                sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                label={
                  <>
                    <Typography variant='body2' component='span'>
                      I agree to{' '}
                    </Typography>
                    <LinkStyled href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </>
                }
              /> */}



