// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import useRoleStore, { Abilities, Ability, GamePermission, Permission } from 'src/features/roles/role.service'

import { yupResolver } from '@hookform/resolvers/yup'

import { Controller, useForm, useWatch } from 'react-hook-form'

import * as yup from 'yup'
import { inputType } from 'src/context/types'
import { Autocomplete, Divider, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { format } from 'date-fns'
import useModuleStore from 'src/features/module/module.service'
import toast from 'react-hot-toast'

interface CardDataType {
  title: string
  avatars: string[]
  totalUsers: number
}

const cardData: CardDataType[] = [
  { totalUsers: 4, title: 'Administrator', avatars: ['1.png', '2.png', '3.png', '4.png'] },
  { totalUsers: 7, title: 'Manager', avatars: ['5.png', '6.png', '7.png', '8.png', '1.png', '2.png', '3.png'] },
  { totalUsers: 5, title: 'Users', avatars: ['4.png', '5.png', '6.png', '7.png', '8.png'] },
  { totalUsers: 3, title: 'Support', avatars: ['1.png', '2.png', '3.png'] },
  { totalUsers: 2, title: 'Restricted User', avatars: ['4.png', '5.png'] }
]

const rolesArr: string[] = [
  'User Management',
  'Content Management',
  'Disputes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll'
]

const abilities: {
  name: string
  id: Abilities
}[] = [
  {
    name: 'Read',
    id: 1
  },
  {
    name: 'Write',
    id: 2
  },
  {
    name: 'Update',
    id: 3
  },
  {
    name: 'Delete',
    id: 4
  }
]

type Props = {
  open: boolean
  setOpen: any
  schema: any
  describedSchema: any
  defaultSchemaValues: any
}

const RolesCards = ({ defaultSchemaValues, describedSchema, open, setOpen, schema }: Props) => {
  const store = useRoleStore()
  const { module, ...moduleStore } = useModuleStore()
  console.log('module: ', module.list?.length)

  // ** Form handler
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    resetField,
    watch
  } = useForm({
    defaultValues: defaultSchemaValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const game = useWatch({
    control,
    name: 'game'
  })

  useEffect(() => {
    if (game) {
      moduleStore.get.paginate({ game_id: game, paginate: false, populate: store.role.isUser ? 1 : 0 })
    }
  }, [game])

  useEffect(() => {
    if (!store?.role?.detail) return

    setValue('order', store?.role?.detail?.order)
    setValue('name', store?.role?.detail?.name)
    console.log('store?.role?.detail?.permission: ', store?.role?.detail?.permissions)
    if (store?.role?.detail?.permissions) {
      const firstGame = Object.keys(store?.role?.detail?.permissions)?.[0]
      setValue('game', firstGame)
      setPermission(store?.role?.detail?.permissions)
    }
  }, [store?.role?.detail])

  // ** States
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([])

  // ** Permission State
  const [permission, setPermission] = useState<Permission>({})
  const handlePermission = (moduleId: number, ability?: Abilities, ids?: number[]) => {
    const value = getValues()
    if (!value.game) {
      return toast.error('Select a game')
    }
    const game = value.game

    setPermission(prev => {
      const newPermission = { ...prev }

      if (!newPermission[game]) {
        newPermission[game] = {}
      }

      if (!newPermission[game][moduleId]) {
        newPermission[game][moduleId] = {
          ability: [],
          ids: []
        }
      }
      if (ability) {
        if (newPermission[game][moduleId].ability.includes(ability)) {
          newPermission[game][moduleId].ability = newPermission[game][moduleId].ability.filter(f => f != ability).sort()
        } else {
          newPermission[game][moduleId].ability = [...newPermission[game][moduleId].ability, ability].sort()
        }
      }

      if (ids?.length) {
        newPermission[game][moduleId].ids = ids
      }

      return newPermission

      // return {
      //   ...prev,
      //   [game]: {
      //     ...prev[game],
      //     [moduleId]: {
      //       ability: [...new Set([...prev[game][moduleId]?.ability, ability])]
      //     }
      //   }
      // }
    })
  }

  const [allPermissions, setAllPermissions] = useState<boolean>(false)
  const handleSelectAllPermission = () => {
    if (allPermissions) {
      setPermission(prev => {
        const newPermission = { ...prev }

        if (newPermission[game]) {
          delete newPermission[game]
        }

        return newPermission
      })
      setAllPermissions(prev => !prev)

      return
    }
    let selected = module.list.reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = {
          ability: [1, 2, 3, 4],
          ids: []
        }
      }
      return acc
    }, {} as GamePermission)

    setPermission(prev => ({ ...prev, [game]: selected }))
    setAllPermissions(prev => !prev)
  }

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
  }

  const onSubmit = () => {
    const values = getValues()
    const newValues = {
      name: values.name,
      permissions: permission,
      order: values.order
    }
    store.add(newValues)
    setOpen(false)
  }

  const togglePermission = (id: string) => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth='md' fullScreen scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h5' component='span'>
            {`${dialogTitle} Role`}
          </Typography>
          <Typography variant='body2'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          {/* <Box sx={{ my: 4 }}> */}
          <Grid container spacing={6}>
            {Object.keys(describedSchema.fields).map(fieldName => {
              const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
              if (field?.meta?.hidden) {
                // setValue(fieldName as any, field.default as any)
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

              if (type == 'date' && field.meta?.type) {
                type = field.meta?.type
              }

              if (field.meta?.type == 'select') {
                if (field.meta?.values) {
                  field.oneOf = field.meta?.values
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

              const values = getValues()

              return (
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Controller
                      name={fieldName as any}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange }, fieldState, formState }) => {
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
                                    setValue(fieldName as any, file as any)
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
                                  setValue(fieldName as any, (typeof value === 'object' ? value?.value : value) as any)
                                }}
                                getOptionLabel={(option: any) => (typeof option == 'object' ? option.label : option)}
                                value={value}
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
                            onChange={
                              type == 'datetime-local'
                                ? e => {
                                    setValue(
                                      fieldName as any,
                                      format(new Date(e.target.value), 'yyyy-MM-dd HH:mm:ss') as any
                                    )
                                  }
                                : onChange
                            }
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
          <Divider sx={{ mb: '10px', mt: '10px' }} />
          <Typography variant='h6'>Role Permissions</Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' }
                      }}
                    >
                      Administrator Access
                      <Tooltip placement='top' title='Allows a full access to the system'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='mdi:information-outline' fontSize='1rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={5}>
                    <FormControlLabel
                      label='Select All'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                      control={<Checkbox size='small' onChange={handleSelectAllPermission} checked={allPermissions} />}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {module?.list?.length ? (
                  module?.list.map(item => {
                    console.log('item: ', item)
                    if (!game) {
                      return
                    }

                    const entry = permission[game]
                    return (
                      <TableRow key={item?.id} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            color: theme => `${theme.palette.text.primary} !important`
                          }}
                        >
                          {item?.name}
                        </TableCell>
                        {abilities.map(ability => {
                          return (
                            <TableCell>
                              <FormControlLabel
                                label={ability.name}
                                checked={entry?.[item.id]?.ability?.includes(ability.id)}
                                control={
                                  <Checkbox
                                    size='small'
                                    onChange={e => {
                                      handlePermission(item.id, ability.id)
                                    }}
                                  />
                                }
                              />
                            </TableCell>
                          )
                        })}
                        {item.options?.length && store.role.isUser ? (
                          <TableCell>
                            <Autocomplete
                              multiple
                              options={[...item.options]}
                              onChange={(e, value: any) => {
                                handlePermission(
                                  item.id,
                                  undefined,
                                  value.map((value: any) => value.value)
                                )

                                // onChange(value)
                                console.log(value)
                              }}
                              value={item.options.filter(f => permission?.[game]?.[item.id]?.ids?.includes(f?.value))}
                              getOptionLabel={(option: any) => (typeof option == 'object' ? option.label : option)}
                              renderInput={params => {
                                return <TextField {...params} label={'Permission'} />
                              }}
                            />
                          </TableCell>
                        ) : (
                          <></>
                        )}
                      </TableRow>
                    )
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button size='large' type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
            <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RolesCards
