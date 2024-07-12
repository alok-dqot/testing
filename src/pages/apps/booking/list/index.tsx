// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports;
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
// import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// import { RootState, AppDispatch } from 'src/store'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, FormHelperText
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import useCompetitionsStore, { Competition } from 'src/features/competitions/competition.service'
import { format } from 'date-fns'
import useSeasonStore from 'src/features/seasons/season.service'
// import DateTimeYearPicker from 'src/views/components/pickers/DateTimeYearPicker'
import DateMonthYearPicker from 'src/views/components/pickers/DateMonthYearPicker'
import useTeamStore from 'src/features/teams/team.service'

interface CellType {
  row: Competition
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Competition }

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.02,
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
    field: 'code',
    minWidth: 80,
    headerName: 'code'
  },

  {
    flex: 0.1,
    field: 'format',
    minWidth: 80,
    headerName: 'format'
  },

  {
    flex: 0.1,
    field: 'status',
    minWidth: 80,
    headerName: 'status'
  },

  {
    flex: 0.1,
    field: 'season',
    minWidth: 80,
    headerName: 'season',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.season.name}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'start_date',
    headerName: 'Start',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{format(new Date(row.created_at), 'dd MMM yyyy hh:mm:ss')}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'end_date',
    headerName: 'End',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{format(new Date(row.end_date), 'dd MMM yyyy hh:mm:ss')}</Typography>
    )
  }
]

const schemaObj = {
  name: yup.string().label('Name').required(),
  code: yup.string().label('Short Name').required(),
  format: yup.string().label('Format').meta({ type: 'select', key: 'FORMATS' }).required(),
  // status: yup.string().label('Status').meta({ type: 'select', key: 'COMPETITION_STATUSES' }).required(),
  season_id: yup.number().label('Season').meta({ type: 'select', key: 'list' }).required(),
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
    .default(format(new Date(), 'yyyy-MM-dd') as any)
}

const extraSchemaObj = {
  status: yup.string().label('Status').meta({ type: 'select', key: 'COMPETITION_STATUSES' }).required()
}

const schema = yup.object().shape(schemaObj)

const PlanList = ({ read, write, update, del }: GlobalProps) => {
  console.log('update: ', update)
  const page_title = 'Competition'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const store = useCompetitionsStore()
  const seasonStore = useSeasonStore()
  const constants = useConstantStore()
  const teamStore = useTeamStore()

  const [defaultValues, setDefaultValues] = useState(schema.getDefault())
  const [describedSchema, setDescribedSchema] = useState(schema.describe())

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
    teamStore.get.list()
    seasonStore.get.paginate({ paginate: false })
  }, [])

  const handleFilter = (val: string) => {
    store.get.paginate({ search: val })
  }

  // ** Handle Edit dialog
  const handleEditClickOpen = async (doReset?: boolean, row?: Competition) => {
    if (doReset) {
      setDefaultValues(schema.getDefault())
      setDescribedSchema(schema.describe())
      setTeamName([])
      reset()
      store.select(null)
    } else {
      const newSchema = schema.concat(yup.object().shape(extraSchemaObj))
      const newdefaultValues = newSchema.getDefault()
      setDefaultValues(newdefaultValues)
      setDescribedSchema(newSchema.describe())

      for (let key in newdefaultValues) {
        setValue(key as any, (row as any)[key])
      }
    }
    try {
      const team = await store.get_team_list()
      if (team && Array.isArray(team)) {
        setTeamName(teamStore.team.list.filter(f => team.includes(f.id)) as any)
      }
    } catch (err) {
      setTeamName([])
    }
    setOpenEdit(true)
  }
  const handleEditClose = () => {
    setTeamName([])
    setOpenEdit(false)
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
          {update && (
            <Tooltip title={`Edit ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  for (let key in defaultValues) {
                    store.select(row?.id)
                    setValue(key as any, row[key])
                  }
                  handleEditClickOpen(false, row)
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
                  handleEditClickOpen(false, row)
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
    const bodyData = getValues() as any
    console.log('teamName: ', teamName)
    bodyData.team_ids = teamName.map((team: any) => team.id)
    console.log('bodyData.team_ids: ', bodyData.team_ids)
    await store.add(bodyData)
    handleEditClose()
  }

  const [teamName, setTeamName] = useState([])

  const icon = <Icon icon='mdi:checkbox-blank-outline' />
  const checkedIcon = <Icon icon='mdi:checkbox-marked-outline' />

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
              rows={store.competition.list}
              columns={columns}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.competition.page - 1,
                pageSize: store.competition.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.competition.page - 1 && pageSize == store.competition.size) return
                store.get.paginate({ page: page + 1, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.competition.total}
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
              {store.competition?.id ? 'Edit' : 'Add'} {page_title}
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

                    let label = field.label
                    if (!label) {
                      label = fieldName.replaceAll('_', ' ')
                      label = label.charAt(0).toUpperCase() + label.slice(1)
                    }
                    let type = inputType[field.type]

                    if (field.meta?.type === 'file') {
                      type = field.meta?.type
                    }

                    if (field.meta?.type == 'select') {
                      field.oneOf = ['Select', ...((constants as any)?.[field.meta?.key as any] || [])]

                      if (label == 'Season') {
                        field.oneOf = seasonStore.season.list.map(item => ({
                          value: item.id,
                          label: item.name
                        }))
                      }
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
                                            setValue(fieldName as any, file)
                                            console.log(file)
                                          }
                                        }}
                                        {...field?.meta?.attr}
                                      />
                                    </>
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

                  <Grid item xs={12}>
                    <Autocomplete
                      options={teamStore.team.list}
                      multiple
                      disableCloseOnSelect
                      onChange={(e, selectedTeams: any) => {
                        // console.log(selectedTeams)
                        setTeamName(selectedTeams)
                      }}
                      getOptionLabel={(option: any) => (typeof option === 'object' ? option.name : option)}
                      value={teamName}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 3 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={params => <TextField {...params} label='Select Team' />}
                    />
                  </Grid>
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
PlanList.moduleId = 3
PlanList.gameIds = [1, 2]
export default PlanList
