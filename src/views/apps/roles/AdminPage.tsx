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
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select, { } from '@mui/material/Select'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { } from 'src/store'
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
  FormHelperText
} from '@mui/material'
// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import useAdminStore, { Admin } from 'src/features/admin/admin.service'
import { format } from 'date-fns'
import { getInitials } from 'src/@core/utils/get-initials'
import useRoleStore from 'src/features/roles/role.service'
import RolesCards from './RoleCards'

interface CellType {
  row: Admin
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Admin }

// ** renders client column
const renderClient = (row: Admin) => {
  return (
    <CustomAvatar skin='light' color={'primary'} sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}>
      {getInitials(row.name ? row.name : 'John Doe')}
    </CustomAvatar>
  )
}

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.1,
    field: 'name',
    minWidth: 80,
    headerName: 'name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant='body2'
              component={Link}
              href='/apps/user/view/overview/'
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row?.name}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'role_id',
    headerName: 'Role',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.role?.name}</Typography>
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
  name: yup.string().label('Name').required(),
  email: yup.string().label('Email').required(),
  password: yup.string().label('Password').required(),
  role_id: yup.number().label('Role').meta({ type: 'select' }).required()
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const AdminPage = () => {
  const page_title = 'User'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const schemas = {
    ROLE: {
      game: yup
        .number()
        .label('Game')
        .required()
    }
  }

  const [open, setOpen] = useState<boolean>(false)
  const [permissionSchema, setPermissionSchema] = useState<any>()
  const [describedPermissionSchema, setDescribedPermissionSchema] = useState<any>()
  const [defaultPermissionSchema, setDefaultPermissionSchema] = useState<any>()

  // ** Hooks
  const store = useAdminStore()
  const roleStore = useRoleStore()
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
    roleStore.get.paginate({ paginate: false })
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

  const handleAdd = () => {
    const newSchema = yup.object().shape(schemas['ROLE'])
    setPermissionSchema(newSchema)
    setDescribedPermissionSchema(newSchema.describe())
    setDefaultPermissionSchema(newSchema.getDefault())
    setOpen(true)
  }

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
          <Tooltip title={`Add New Permission`}>
            <IconButton
              size='small'
              onClick={() => {
                roleStore.get.detail(row?.id, row, true)
                handleAdd()
              }}
            >
              <Icon icon='mdi:key-plus' fontSize={20} />
            </IconButton>
          </Tooltip>
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
            </Box>
            <DataGrid
              autoHeight
              pagination
              rows={store.admin.list}
              columns={columns}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.admin.page - 1,
                pageSize: store.admin.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.admin.page - 1 && pageSize == store.admin.size) return
                store.get.paginate({ page: page + 1, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.admin.total}
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
              {store.admin?.id ? 'Edit' : 'Add'} {page_title}
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
                      if (fieldName == 'role_id') {
                        field.oneOf = roleStore.role.list.map(role => ({ value: role.id, label: role.name }))
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

      {open ? (
        <RolesCards
          open={open}
          schema={permissionSchema}
          describedSchema={describedPermissionSchema}
          defaultSchemaValues={defaultPermissionSchema}
          setOpen={setOpen}
        />
      ) : (
        <></>
      )}
    </DatePickerWrapper>
  )
}

export default AdminPage
