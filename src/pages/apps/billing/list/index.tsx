// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CustomChip from 'src/@core/components/mui/chip'
// ** Icon Imports


// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import useBillingStore, { Billing } from 'src/features/billing/billing.service'


import {
  Autocomplete,
  Button, CardContent, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'


// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import { BoxProps } from '@mui/system'
import { getPublicUrl } from 'src/helpers/common'
import Icon from 'src/@core/components/icon'

interface CellType {
  row: Billing
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
// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Billing }

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.13,
    field: 'id',
    minWidth: 70,
    headerName: 'Invoice Id',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/`} onClick={e => e.preventDefault()}>{`${row.id}`}</LinkStyled>
    )
  },

  // {
  //   flex: 0.1,
  //   minWidth: 90,
  //   field: 'invoice_id',
  //   headerName: 'Invoice Id',
  //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.invoice_id}`}</Typography>
  // },


  {
    flex: 0.1,
    minWidth: 90,
    field: 'type',
    headerName: 'Plan',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.plan?.plans}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'billing_date',
    headerName: 'Billing Date',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.created_at}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.amount}`}</Typography>
  },




  {
    flex: 0.1,
    minWidth: 90,
    field: 'tax',
    headerName: 'Tax',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.tax_amount}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.total}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total_hits',
    headerName: 'Total Hits',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.plan?.api_calls}`}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip size='small' skin='light' color={row?.subscription?.status?.toLowerCase() == 'inactive' ? 'error' : 'success'} label={row?.subscription?.status} />
      )
    }
  }
]

const schema = yup.object().shape({
  status: yup.string().default('created').meta({ hidden: true }).required(),
  subscription_id: yup.number().meta({ hidden: true }),
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'Billings'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const store = useBillingStore()
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
    store.get.paginate({ size: 10, page: 1 })
  }, [])

  const handleFilter = (val: string) => {
    store.get.paginate({ search: val })
  }

  // ** Handle Edit dialog
  const handleEditClickOpen = (doReset?: boolean) => {
    if (doReset) {
      reset()
      store.select(null)
    }

    setOpenEdit(true)
  }
  const handleEditClose = () => setOpenEdit(false)

  const columns: GridColDef[] = [
    ...defaultColumns,
    // {
    //   flex: 0.1,
    //   minWidth: 130,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: ({ row }: any) => (
    //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //       {update && (

    //         <Button
    //           variant='contained'
    //           sx={{ px: 6 }}
    //           onClick={() => {

    //             store.select(row)
    //             handleEditClickOpen(false)

    //           }}
    //         >
    //           View

    //         </Button>

    //         // <Tooltip title={`Edit ${page_title}`}>
    //         //   <IconButton
    //         //     size='small'
    //         //     onClick={() => {
    //         //       for (let key in defaultValues) {
    //         //         setValue(key as any, row[key])
    //         //         handleEditClickOpen()
    //         //       }
    //         //       store.select(row?.id)
    //         //     }}
    //         //   >
    //         //     <Icon icon='mdi:edit-outline' fontSize={20} />
    //         //   </IconButton>
    //         // </Tooltip>
    //       )}
    //       {/* {del && (
    //         <Tooltip title={`Delete ${page_title}`}>
    //           <IconButton
    //             size='small'
    //             onClick={() => {
    //               store.select(row?.id)
    //               store.delete()
    //             }}
    //           >
    //             <Icon icon='mdi:delete-outline' fontSize={20} />
    //           </IconButton>
    //         </Tooltip>
    //       )}

    //       {write && (
    //         <Tooltip title={`Copy ${page_title}`}>
    //           <IconButton
    //             size='small'
    //             onClick={() => {
    //               for (let key in defaultValues) {
    //                 setValue(key as any, row[key])
    //                 handleEditClickOpen()
    //               }
    //             }}
    //           >
    //             <Icon icon='mdi:content-copy' fontSize={20} />
    //           </IconButton>
    //         </Tooltip>
    //       )} */}
    //     </Box>
    //   )
    // }
  ]

  const {
    plan: { detail },
  } = useBillingStore()

  const onSubmit = async () => {

    let bodyData = getValues()
    bodyData.subscription_id = detail?.id as any

    // await store.verify(bodyData)
    handleEditClose()
  }


  const statusMenus = [

    {
      name: "Active",
      value: 'ACTIVE',
    },
    {
      name: "In Active",
      value: 'IN_ACTIVE',
    },
    {
      name: "Created",
      value: 'CREATED',
    },
    {
      name: "Rejected",
      value: 'REJECTED',
    },
  ]








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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

                <Autocomplete
                  id="free-solo-demo"
                  size='small'
                  sx={{ width: '250px' }}
                  getOptionLabel={(option: any) => option?.name}
                  onChange={(e, value: any) => {
                    console.log(value)
                    handleFilter(value?.value)
                  }}
                  freeSolo
                  options={statusMenus}
                  renderInput={(params) => <TextField {...params} label="Select Actions" margin="normal" />}
                />
              </Box>

              {/* <Select
                  size='small'
                  displayEmpty
                  defaultValue=''
                  sx={{ mr: 4, mb: 2 }}
                  // disabled={true}
                  onChange={e => handleFilter(e.target.value)}

                >

                  {
                    statusMenus.length > 0 && statusMenus.map((status: any) => {
                      return (
                        <MenuItem value={status.value}>{status.name}</MenuItem>
                      )
                    }
                    )
                  }

                </Select> */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size='small'
                  sx={{ mr: 4, mb: 2 }}
                  placeholder={`Search ${page_title}`}
                  onChange={e => handleFilter(e.target.value)}
                />
                {/* {write && (
                  <Button
                    sx={{ mb: 2 }}
                    variant='contained'
                    onClick={() => {
                      handleEditClickOpen(true)
                    }}
                  >
                    Create {page_title}
                  </Button>
                )} */}
              </Box>
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
              View Payment
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

              <Card>
                <Grid item xs={12} sm={12}>
                  <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>



                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={5}>
                        <StyledBox>
                          <Box
                            sx={{
                              mb: 6.75,
                              display: 'flex',
                              alignItems: 'center',
                              '& svg': { color: 'primary.main', mr: 2.75 }
                            }}
                          >
                            <Icon icon='mdi:lock-open-outline' fontSize={20} />
                            <Typography variant='body2'>{detail?.id}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}>
                            <Icon icon='mdi:currency-rupee' fontSize={20} />
                            <Typography variant='body2'>{detail?.plan?.amount}</Typography>
                          </Box>

                        </StyledBox>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <Box
                          sx={{ mb: 6.75, display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}
                        >
                          <Icon icon='mdi:star-outline' fontSize={20} />
                          <Typography variant='body2'>{detail?.plan?.plans} ( {detail?.plan?.period} )</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}>
                          <Icon icon='mdi:trending-up' fontSize={20} />
                          <Typography variant='body2'>{detail?.plan?.matches_access}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={7}>

                        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}>
                          <Icon icon='mdi:api' fontSize={20} />
                          <Typography variant='body2'>{detail?.plan?.api_calls} Api Calls</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={7}>

                        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}>
                          <Icon icon='mdi:alpha-s-box-outline' fontSize={20} />
                          <Typography variant='body2'>Currently {detail ? (
                            <CustomChip size='small' skin='light' color='success' label=' Active' />
                          ) : (
                            <CustomChip size='small' skin='light' color='error' label='Not Active' />
                          )
                          }</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </Card>

              <Grid container>


                <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={getPublicUrl(detail?.payment_img) || ''}
                    alt='item.title'
                    width='300px'
                    height='300px'
                    style={{ margin: 'auto', }}
                  />
                </Grid>

              </Grid>



              <form>
                <Grid container spacing={6}>
                  {Object.keys(describedSchema.fields).map(fieldName => {
                    const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
                    if (field?.meta?.hidden) {
                      return <></>
                    }

                    const label = field.label
                    const type = inputType[field.type]

                    if (field.meta?.type == 'select') {
                      field.oneOf = ['Select', ...((constants as any)?.[field.meta?.key as any] || [])]
                      // console.log('label: ', label)
                    }

                    if (field.type == 'boolean') {
                      field.oneOf = [
                        {
                          value: 1,
                          label: 'YES'
                        },
                        {
                          value: 0,
                          label: 'NO'
                        }
                      ]
                    }

                    return (
                      <Grid item xs={12} sm={12}>

                        <FormControl fullWidth>

                          <Controller
                            name={fieldName as any}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {
                              try {
                                if (field.oneOf.length) {
                                  return (
                                    <Autocomplete
                                      options={[...field.oneOf]}
                                      onChange={(e, value: any) => {
                                        setValue(
                                          fieldName as any,
                                          (typeof value === 'object' ? value?.value : value) as any
                                        )
                                      }}
                                      getOptionLabel={(option: any) =>
                                        typeof option == 'object' ? option.label : option
                                      }
                                      value={
                                        field.oneOf.find((f: any) => {
                                          return f.value == value
                                        }) || value
                                      }
                                      renderInput={params => {
                                        return <TextField {...params} label={label} />
                                      }}
                                    />
                                  )
                                }
                              } catch (e) {
                                console.error(fieldName)
                                return <></>
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
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => {
                setValue('status', "approved" as any)
                handleSubmit(onSubmit)();
              }
              }>
                Approved
              </Button>
              <Button variant='outlined' color='primary' sx={{ mr: 2 }} onClick={() => {
                setValue('status', "decline" as any)
                handleSubmit(onSubmit)()
              }

              }>
                Decline
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
