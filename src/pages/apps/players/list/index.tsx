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
import CardContent from '@mui/material/CardContent'
import Select, { } from '@mui/material/Select'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { } from 'src/store'
// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText
} from '@mui/material'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import useConstantStore from 'src/features/constants/constants.service'
import usePlayerStore, { Player } from 'src/features/players/player.service'
import { format } from 'date-fns'
import useCompetitionsStore from 'src/features/competitions/competition.service'
import { getPublicUrl } from 'src/helpers/common'
import { } from 'immutable'
import useTeamStore from 'src/features/teams/team.service'
import DateMonthYearPicker from 'src/views/components/pickers/DateMonthYearPicker'

interface CellType {
  row: Player
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Player }

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.03,
    field: 'id',
    minWidth: 40,
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
      <LinkStyled href={`/`} onClick={e => e.preventDefault()} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
        <Avatar alt='' src={'' + getPublicUrl(row.image)} sx={{ mr: 3 }} />
        <Box sx={{ mt: 2.4 }}>{`${row.name}`}</Box>
      </LinkStyled>
    )
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'date_of_birth',
    headerName: 'DOB',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.date_of_birth}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'gender',
    headerName: 'gender',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.gender}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'country',
    headerName: 'Country',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.country?.name}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'playing_role',
    headerName: 'Playing role',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.playing_role}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'batting_style',
    headerName: 'Batting Style',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.batting_style}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'credit',
    headerName: 'Credit',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.credit}</Typography>
  }
]

const schema = yup.object().shape({
  name: yup.string().label('Name').meta({}).required(),
  short_name: yup.string().required(),
  date_of_birth: yup.date().required(),
  gender: yup.string().meta({ type: 'select', key: 'GENDERS' }).required(),
  country_id: yup.number().label('Country').meta({ type: 'select', key: 'list' }).required(),
  image: yup
    .mixed()
    .meta({ type: 'file', attr: { accept: 'image/x-png,image/gif,image/jpeg' } })
    .required(),
  playing_role: yup.string().meta({ type: 'select', key: 'ROLES' }).required(),
  batting_style: yup.string().oneOf(['LEFT', 'RIGHT', 'NONE']).required(),
  bowling_style: yup.string().oneOf(['SPIN', 'FAST', 'NONE']).required(),
  credit: yup.number().required()
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'Player'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  // ** Hooks
  const store = usePlayerStore()
  const constants = useConstantStore()
  const competitionStore = useCompetitionsStore()
  const teamStore = useTeamStore()

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
    const init = async () => {
      await teamStore.get.list()
      await competitionStore.get.list()
      store.get.paginate({ size: 10, page: 1 })
    }
    init()
  }, [])

  const handleFilter = (val: string) => {
    store.get.paginate({ search: val })
  }

  // ** Handle Edit dialog
  const handleEditClickOpen = async (doReset?: boolean) => {
    if (doReset) {
      set_competition_team_ids([
        {
          competition_id: null,
          team_id: null
        }
      ])
      reset()
      store.select(null)
    }

    try {
      const updateComp = await store.select_competition()
      set_competition_team_ids(
        ((updateComp || []) as any).map((item: any) => ({
          competition_id: item?.competition_id,
          team_id: item?.team_id
        }))
      )
    } catch (err) {
      set_competition_team_ids([
        {
          competition_id: null,
          team_id: null
        }
      ])
    }

    setOpenEdit(true)
  }

  const handleEditClose = () => {
    set_competition_team_ids([
      {
        competition_id: null,
        team_id: null
      }
    ])
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
                  store.select(row?.id)
                  for (let key in defaultValues) {
                    setValue(key as any, row[key])
                  }
                  handleEditClickOpen()
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
                  }
                  handleEditClickOpen()
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
    bodyData.competition_team_ids = competition_team_ids
    await store.add(bodyData)
    handleEditClose()
  }

  const [competition_team_ids, set_competition_team_ids] = useState([
    {
      competition_id: null,
      team_id: null
    }
  ])

  function handleUpdateCompetition(comp: any, id: number, isComp: boolean) {
    set_competition_team_ids(prevCompetitionTeamIds => {
      return prevCompetitionTeamIds.map((playerComp, index) => {
        if (index == id) {
          if (isComp === true) {
            return {
              ...playerComp,
              competition_id: comp
            }
          } else {
            return {
              ...playerComp,
              team_id: comp
            }
          }
        }
        return playerComp
      })
    })
  }

  function handleAddNewCompTeam() {
    const newCompTeam = {
      competition_id: null,
      team_id: null
    }

    set_competition_team_ids([...competition_team_ids, newCompTeam])
  }

  function handleRemoveTeam(idToRemove: any) {
    const comp = competition_team_ids.filter((item, index) => index !== idToRemove)
    // console.log(comp);
    set_competition_team_ids(comp)
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
              rows={store.player.list}
              columns={columns}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.player.page - 1,
                pageSize: store.player.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.player.page - 1 && pageSize == store.player.size) return
                store.get.paginate({ page: page + 1, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.player.total}
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
              {store.player?.id ? 'Edit' : 'Add'} {page_title}
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
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
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
                                          setValue(fieldName as any, file)
                                        }
                                      }}
                                      {...field?.meta?.attr}
                                    />
                                  </>
                                )
                              }
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
                              // if (field.oneOf.length) {
                              //   return (
                              //     <>
                              //       <InputLabel id={`user-view-${fieldName}`}>{label}</InputLabel>

                              //       <Select
                              //         value={value}
                              //         label={label}
                              //         onChange={onChange}
                              //         error={Boolean((errors as any)[fieldName])}
                              //         labelId={`user-view-${fieldName}`}
                              //       >
                              //         {field.oneOf.map((item: any) => {
                              //           if (typeof item === 'object') {
                              //             return <MenuItem value={item?.value}>{item?.label}</MenuItem>
                              //           }
                              //           return <MenuItem value={item}>{item}</MenuItem>
                              //         })}
                              //       </Select>
                              //     </>
                              //   )
                              // }
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
                    <CardContent>
                      <Button className='add-player-more-btn' variant='outlined' onClick={() => handleAddNewCompTeam()}>
                        Add More
                      </Button>
                      <Box
                        sx={{
                          p: 5,
                          display: 'flex',
                          borderRadius: 1,
                          flexDirection: ['column'],
                          justifyContent: ['space-between'],
                          alignItems: ['flex-start', 'center'],
                          mb: 4,
                          border: theme => `1px solid ${theme.palette.divider}`
                        }}
                      >
                        {competition_team_ids.map((player, index) => {
                          return (
                            <TeamPlayer
                              player={player}
                              teamList={teamStore.team.list}
                              compList={competitionStore.competition.list}
                              id={index}
                              handleUpdateCompetition={handleUpdateCompetition}
                              handleRemoveTeam={handleRemoveTeam}
                            />
                          )
                        })}
                      </Box>
                    </CardContent>
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
PlanList.moduleId = 6
PlanList.gameIds = [1, 2]
export default PlanList

const TeamPlayer = (data: any) => {
  return (
    <>
      <Grid container className='more-team-player-container' spacing={2}>
        <Grid item xs={5}>
          <Autocomplete
            options={data.compList}
            onChange={(e, value: any) => {
              data.handleUpdateCompetition(value.id, data.id, true)
            }}
            getOptionLabel={(option: any) => (typeof option == 'object' ? option.name : option)}
            value={data.compList.find((comp: any) => comp.id === data.player.competition_id)}
            renderInput={params => {
              return <TextField {...params} label='Competition Name' />
            }}
          />
        </Grid>
        <Grid item xs={5.4}>
          <Autocomplete
            options={data.teamList}
            onChange={(e, value: any) => {
              data.handleUpdateCompetition(value.id, data.id, false)
            }}
            getOptionLabel={(option: any) => (typeof option == 'object' ? option.name : option)}
            value={data.teamList.find((comp: any) => comp.id === data.player.team_id)}
            renderInput={params => {
              return <TextField {...params} label='Team Name' />
            }}
          />
        </Grid>

        <Grid item xs={1}>
          <Icon icon={'mdi:delete-outline'} onClick={() => data.handleRemoveTeam(data.id)} />
        </Grid>
      </Grid>
    </>
  )
}
