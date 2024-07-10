// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
// import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
// import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
// import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
// import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import useRoundStore, { Round } from 'src/features/rounds/round.service'
import { format } from 'date-fns'
import useCompetitionsStore from 'src/features/competitions/competition.service'
// import moment from 'moment'
// import DateTimeYearPicker from 'src/views/components/pickers/DateTimeYearPicker'
import DateMonthYearPicker from 'src/views/components/pickers/DateMonthYearPicker'

interface CellType {
  row: Round
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Round }

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
    flex: 0.1,
    field: 'name',
    minWidth: 80,
    headerName: 'name',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/`} onClick={e => e.preventDefault()}>{`${row.name}`}</LinkStyled>
    )
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'type',
    headerName: 'type',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.type}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'format',
    headerName: 'format',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.format}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'competition',
    headerName: 'Competition',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.competition.name}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'created_at',
    headerName: 'Created At',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{format(new Date(row.created_at), 'dd MMM yyyy ')}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'updated_at',
    headerName: 'Last updated',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{format(new Date(row.updated_at), 'dd MMM yyyy ')}</Typography>
    )
  }
]

const schema = yup.object().shape({
  name: yup.string().label('Name').meta({}).required(),

  order: yup.number().label('Order').required(),
  type: yup.string().label('Type').meta({ type: 'select', key: 'ROUND_TYPES' }).required(),
  format: yup.string().label('Format').meta({ type: 'select', key: 'FORMATS' }).required(),
  start_date: yup
    .date()
    .label('Start Date')
    .meta({ type: 'date' })
    .required()
    .default(format(new Date(), 'yyyy-MM-dd') as any),
  end_date: yup
    .date()
    .label('End Date')
    .meta({ type: 'date' })
    .required()
    .default(format(new Date(), 'yyyy-MM-dd') as any),
  competition_id: yup
    .number()
    .label('Competition')
    .meta({
      type: 'select',
      key: 'list'
    })
    .required()
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'Round'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  // ** Hooks
  const store = useRoundStore()
  const constants = useConstantStore()
  const competitionStore = useCompetitionsStore()

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
    competitionStore.get.paginate({ paginate: false })
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
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {update && (
            <Tooltip title={`Edit ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  for (let key in defaultValues) {
                    console.log('row[key]: ', row[key])
                    setValue(key as any, row[key])
                    handleEditClickOpen()
                  }
                  store.select(row?.id)
                }}
              >
                <Icon icon='mdi:edit-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
          {del && (
            <Tooltip title={`Delete ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  store.select(row?.id)
                  store.delete()
                }}
              >
                <Icon icon='mdi:delete-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}

          {write && (
            <Tooltip title={`Copy ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  for (let key in defaultValues) {
                    setValue(key as any, row[key])
                    handleEditClickOpen()
                  }
                }}
              >
                <Icon icon='mdi:content-copy' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  const onSubmit = async () => {
    const bodyData = getValues()
    await store.add(bodyData)
    handleEditClose()
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
              <Select
                size='small'
                displayEmpty
                defaultValue=''
                sx={{ mr: 4, mb: 2 }}
                disabled={true}
                renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
              >
                <MenuItem disabled>Actions</MenuItem>
                <MenuItem value='Delete'>Delete</MenuItem>
                <MenuItem value='Edit'>Edit</MenuItem>
                <MenuItem value='Send'>Send</MenuItem>
              </Select>
              {write && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    size='small'
                    sx={{ mr: 4, mb: 2 }}
                    placeholder={`Search ${page_title}`}
                    onChange={e => handleFilter(e.target.value)}
                  />
                  <Button
                    sx={{ mb: 2 }}
                    variant='contained'
                    onClick={() => {
                      handleEditClickOpen(true)
                    }}
                  >
                    Create {page_title}
                  </Button>
                </Box>
              )}
            </Box>
            <DataGrid
              autoHeight
              pagination
              rows={store.round.list}
              columns={columns}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.round.page - 1,
                pageSize: store.round.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.round.page - 1 && pageSize == store.round.size) return
                store.get.paginate({ page: page + 1, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.round.total}
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
              {store.round?.id ? 'Edit' : 'Add'} {page_title}
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
              <form onSubmit={handleSubmit(onSubmit)}>
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

                      if (label == 'Competition') {
                        field.oneOf = competitionStore.competition.list.map(item => ({
                          value: item.id,
                          label: item.name
                        }))
                      }
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

                                if (type === 'date') {
                                  return (
                                    <DateMonthYearPicker
                                      label={label}
                                      value={value}
                                      onChange={(date: Date) => {
                                        setValue(fieldName as any, format(new Date(date), 'yyyy-MM-dd'))
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

PlanList.moduleId = 4
PlanList.gameIds = [1, 2]
export default PlanList
