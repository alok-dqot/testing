// ** React Imports
import { useState, useEffect, forwardRef, useContext } from 'react'

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
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { RootState, AppDispatch } from 'src/store'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Switch
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import useSeasonStore, { Season } from 'src/features/seasons/season.service'
import { format } from 'date-fns'
import { AbilityContext } from 'src/layouts/components/acl/Can'

interface CellType {
  row: Season
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Season }

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.05,
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
    field: 'created_at',
    headerName: 'Created At',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{format(new Date(row.created_at), 'dd MMM yyyy hh:mm:ss')}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'updated_at',
    headerName: 'Last updated',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{format(new Date(row.updated_at), 'dd MMM yyyy hh:mm:ss')}</Typography>
    )
  }
]

const schema = yup.object().shape({
  name: yup.string().label('Name').meta({}).required()
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = () => {
  const page_title = 'Season'

  const {
    module: { read, write, update, del }
  } = useContext(AbilityContext)

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const store = useSeasonStore()
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
              rows={store.season.list}
              columns={columns}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.season.page - 1,
                pageSize: store.season.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.season.page - 1 && pageSize == store.season.size) return
                store.get.paginate({ page: page + 1, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.season.total}
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
              {store.season?.id ? 'Edit' : 'Add'} {page_title}
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
                      console.log('label: ', label)
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
                              if (field.oneOf.length) {
                                return (
                                  <>
                                    <InputLabel id={`user-view-${fieldName}`}>{label}</InputLabel>

                                    <Select
                                      value={value}
                                      label={label}
                                      onChange={onChange}
                                      error={Boolean((errors as any)[fieldName])}
                                      labelId={`user-view-${fieldName}`}
                                    >
                                      {field.oneOf.map((item: any) => {
                                        if (typeof item === 'object') {
                                          return <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        }
                                        return <MenuItem value={item}>{item}</MenuItem>
                                      })}
                                    </Select>
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

PlanList.moduleId = 2
PlanList.gameIds = [1, 2]
export default PlanList
