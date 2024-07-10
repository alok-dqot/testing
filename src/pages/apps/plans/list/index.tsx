// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import clipboardCopy from 'clipboard-copy'
// ** Icon
import { BoxProps, Divider, ListItemText, styled } from '@mui/material'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import usePlanStore, { Plan } from 'src/features/plans/plans.service'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import Icon from 'src/@core/components/icon'
import QrcodeCard from 'src/views/dashboards/analytics/QrcodeCard'
import CustomChip from 'src/@core/components/mui/chip'
import { getMatchId } from 'src/features/botUser/botUser.service'

interface CellType {
  row: Plan
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))




const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))



// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Plan }

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.03,
    field: 'id',
    minWidth: 70,
    headerName: 'Id',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/`} onClick={e => e.preventDefault()}>{`${row.id}`}</LinkStyled>
    )
  },
  {
    flex: 0.03,
    field: 'plans',
    minWidth: 80,
    headerName: 'plans',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/`} onClick={e => e.preventDefault()}>{`${row.plans}`}</LinkStyled>
    )
  },
  {
    flex: 0.01,
    minWidth: 90,
    field: 'match_format',
    headerName: 'Format',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.match_format}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'coverage',
    headerName: 'Coverage',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.coverage}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'matches_access',
    headerName: 'Matches Access',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.matches_access}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'api_access',
    headerName: 'API Access',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.api_access}`}</Typography>
  },
  {
    flex: 0.03,
    minWidth: 90,
    field: 'fantasy_player_credits',
    headerName: 'Credits',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{row.fantasy_player_credits ? 'YES' : 'NO'}</Typography>
    )
  },
  {
    flex: 0.03,
    minWidth: 90,
    field: 'fantasy_points_api',
    headerName: 'Points API',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.fantasy_points_api ? 'YES' : 'NO'}</Typography>
  },
  {
    flex: 0.02,
    minWidth: 90,
    field: 'period',
    headerName: 'Period',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.period}`}</Typography>
  },
  {
    flex: 0.03,
    minWidth: 90,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.amount}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'is_active',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return row.is_active ? (
        <CustomChip size='small' skin='light' color='success' label=' Active' />
      ) : (
        <CustomChip size='small' skin='light' color='error' label='Not Active' />
      )
    }
  }
]

const schema = yup.object().shape({

  plan_id: yup
    .number()
    .meta({ hidden: true })
  ,
  game_id: yup
    .number()
    .meta({ hidden: true })
  ,
  payment_img: yup
    .mixed()
    .label('Upload Images')
    .meta({ type: 'file', attr: { accept: 'image/x-png,image/gif,image/jpeg' } })
    .required(),

})


const defaultValues = schema.getDefault()
const describedSchema = schema.describe()




const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'Plan'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  // const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })





  const upi = 'testme@paytm';
  const [cipboard, setClipBoard] = useState<string>('')

  const Copy = (id: string) => async () => {
    await clipboardCopy(id)
    setClipBoard(id)
  }



  const {
    plan: { detail, payDetail },
  } = usePlanStore()

  // ** Hooks
  const store = usePlanStore()
  const constants = useConstantStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    store.get.paginate({ size: 10, page: 1, })
  }, [])

  // const handleFilter = (val: string) => {
  //   store.get.paginate({ search: val })
  // }

  // ** Handle Edit dialog
  const handleEditClickOpen = (doReset?: boolean) => {
    if (doReset) {
      reset()
      store.select(null)
    }

    setOpenEdit(true)
  }
  const handleEditClose = () => {
    reset()
    setOpenEdit(false)

  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.11,
      minWidth: 90,
      field: 'upgrade',
      headerName: '',
      renderCell: ({ row }: CellType) => <Button
        variant='contained'
        sx={{ px: 6 }}
        onClick={() => {
          store.selectPayment(row)
          handleEditClickOpen(false)

        }}
      >
        {row?.is_purchased || row?.is_active ? 'Upgrade' : 'Select Plan'}

      </Button>
    }
  ]

  const onSubmit = async () => {
    let bodyData = getValues()
    let game_id = getMatchId()
    bodyData.plan_id = detail?.id as any
    bodyData.game_id = game_id as any
    const res = await store.pay(bodyData)
    handleEditClose()
    // if (res?.status) {
    //
    // }
  }




  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                pb: 3,
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='h5' component='h4'>{page_title}</Typography>
            </Box>
            <DataGrid
              autoHeight
              pagination
              rows={store.plan.list}
              columns={columns}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.plan.page - 1,
                pageSize: store.plan.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.plan.page - 1 && pageSize == store.plan.size) return
                store.get.paginate({ page: page + 1, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.plan.total}
            />
          </Card>
          {/* Add/Edit Dialog */}
          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            aria-describedby='user-view-edit-description'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              {detail?.plans}
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText
                variant='body2'
                id='user-view-edit-description'
                sx={{ textAlign: 'center', mb: 7 }}
              ></DialogContentText>
              <form >
                <Grid container spacing={6}>
                  {Object.keys(describedSchema.fields).map(fieldName => {
                    const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
                    if (field?.meta?.hidden) {
                      return <></>
                    }

                    const label = field.label
                    let type = inputType[field.type]

                    // if (field.meta?.type == 'select') {
                    //   field.oneOf = ['Select', ...((constants as any)?.[field.meta?.key as any] || [])]
                    // }

                    if (field.meta?.type === 'file') {
                      type = field.meta?.type
                    }


                    return (
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>

                          <Card>
                            <Grid container sx={{ padding: '10px' }}>
                              <Grid item xs={6} sm={6} sx={{ textAlign: 'left' }}>
                                <ListItemText primary='Plan' />
                                <ListItemText primary='Price' />
                                <ListItemText primary='Tax' />
                                <ListItemText primary='Tax Amount' />

                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ textAlign: 'right' }}>
                                <ListItemText primary={detail?.plans} />
                                <ListItemText primary={payDetail.amount} />
                                <ListItemText primary={payDetail?.tax + '%'} />
                                <ListItemText primary={payDetail?.tax_amount} />
                              </Grid>

                            </Grid>
                            <Divider sx={{ my: '0 !important', }} />
                            <Grid container sx={{ padding: '20px', paddingInline: '25px' }}>
                              <Grid item xs={6} sm={6} sx={{ textAlign: 'left' }}>
                                <ListItemText primary='Total Amount' />

                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ textAlign: 'right' }}>
                                <ListItemText primary={payDetail?.total_amount} />
                              </Grid>

                            </Grid>
                          </Card>



                          <Accordion>
                            <AccordionSummary
                              expandIcon={<Icon icon={'mdi:chevron-down'} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                            >
                              QR Code
                            </AccordionSummary>
                            <AccordionDetails>
                              <QrcodeCard />
                            </AccordionDetails>
                          </Accordion>


                          <Accordion>
                            <AccordionSummary
                              expandIcon={<Icon icon={'mdi:chevron-down'} />}
                              aria-controls="panel2-content"
                              id="panel2-header"
                            >
                              UPI ID
                            </AccordionSummary>
                            <AccordionDetails>
                              <FormControl fullWidth>
                                <InputLabel htmlFor='form-layouts-basic-token'>token</InputLabel>
                                <OutlinedInput
                                  label='token'
                                  defaultValue={'  '}
                                  value={upi}
                                  disabled
                                  type={'text'}
                                  id='form-layouts-basic-accessKey'
                                  endAdornment={
                                    <InputAdornment position='end'>
                                      <IconButton
                                        edge='end'
                                        onClick={Copy(upi)}
                                        color={cipboard.length > 0 ? 'success' : 'default'}
                                      >
                                        <Icon icon={cipboard.length > 0 ? 'mdi:check-circle' : 'mdi:content-copy'} />
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                />
                                <FormHelperText id='form-layouts-basic-password-accessKey'></FormHelperText>
                              </FormControl>
                            </AccordionDetails>
                          </Accordion>



                          <Controller
                            name={fieldName as any}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {

                              if (type == 'file') {

                                return (
                                  <>
                                    <Button variant='outlined' fullWidth size='large' color='secondary'>
                                      <label
                                        htmlFor={`user-view-${fieldName}`}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          display: 'flex',
                                          justifyContent: 'start',
                                          alignItems: 'center',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Icon icon={'mdi:cloud-upload-outline'} />
                                        <p
                                          style={{
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            margin: '0 0 0 5px'
                                          }}
                                        >
                                          {value?.name || label}
                                        </p>
                                      </label>
                                    </Button>

                                    <input
                                      type='file'
                                      id={`user-view-${fieldName}`}
                                      hidden
                                      onChange={e => {
                                        let file = e.target.files?.[0]
                                        if (file) {
                                          // console.log(fieldName as any, file)

                                          setValue(fieldName as any, file)
                                        }
                                      }}
                                      {...field?.meta?.attr}
                                    />
                                    {value && <>
                                      <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                          src={URL.createObjectURL(value) || ''}
                                          alt='item.title'
                                          width='200px'
                                          height='200px'
                                          style={{ margin: 'auto', marginTop: '10px' }}
                                        />
                                      </Grid>
                                    </>}
                                  </>
                                )

                              }




                              return (
                                <TextField
                                  value={value}
                                  label={label}
                                  onChange={onChange}
                                  type={type}
                                  error={Boolean((errors as any)[fieldName])}
                                />
                              )
                            }}
                          />
                          {(errors as any)[fieldName] && (
                            <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-first-name'>
                              {(errors as any)[fieldName]?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )
                  })}
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

PlanList.moduleId = 9
PlanList.gameIds = [1]

export default PlanList













