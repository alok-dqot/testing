// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
// ** Demo Components Imports
import RoleCards from 'src/views/apps/roles/RoleCards'
import useRoleStore from 'src/features/roles/role.service'
import { useEffect, useState } from 'react'
// ** Third Party Imports
import * as yup from 'yup'
import { Avatar, AvatarGroup, Box, Button, Card, CardContent, IconButton } from '@mui/material'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import useModuleStore from 'src/features/module/module.service'
import AdminPage from 'src/views/apps/roles/AdminPage'

const RolesComponent = () => {
  const store = useRoleStore()
  const moduleStore = useModuleStore()

  const schemas = {
    ROLE: {
      name: yup.string().label('Name').meta({}).required(),
      order: yup.number().label('Order').meta({}).required()
    }
  }

  const [open, setOpen] = useState<boolean>(false)
  const [schema, setSchema] = useState<any>()
  const [describedSchema, setDescribedSchema] = useState<any>()
  const [defaultSchema, setDefaultSchema] = useState<any>()

  useEffect(() => {
    store.get.paginate({ size: 10, page: 1 })
  }, [])

  const handleAdd = () => {
    const newSchema = yup.object().shape(schemas['ROLE'])
    setSchema(newSchema)
    setDescribedSchema(newSchema.describe())
    setDefaultSchema(newSchema.getDefault())
    setOpen(true)
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Roles List</Typography>}
        subtitle={
          <Typography variant='body2'>
            A role provided access to predefined menus and features so that depending on assigned role an administrator
            can have access to what he need
          </Typography>
        }
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Grid container spacing={6} className='match-height'>
          {store.role.list?.length ? (
            store.role.list.map((item, index: number) => (
              <Grid item xs={12} sm={6} lg={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='body2'>{`Total ${2} users`}</Typography>
                      <AvatarGroup
                        max={4}
                        sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.875rem' } }}
                      >
                        <Avatar alt={'item.title'} src={`/images/avatars/1.png`} />
                      </AvatarGroup>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <Typography variant='h6'>{item?.name}</Typography>
                        <Typography
                          href='/'
                          variant='body2'
                          component={Link}
                          sx={{ color: 'primary.main', textDecoration: 'none' }}
                          onClick={e => {
                            e.preventDefault()
                            store.get.detail(item?.id, item)
                            handleAdd()
                          }}
                        >
                          Edit Role
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton color='error'>
                          <Icon
                            icon='mdi:delete-outline'
                            fontSize={20}
                            onClick={e => {
                              store.select(item.id)
                              store.delete()
                            }}
                          />
                        </IconButton>
                        <IconButton sx={{ color: 'text.secondary' }}>
                          <Icon
                            icon='mdi:content-copy'
                            fontSize={20}
                            onClick={e => {
                              store.get.detail(null as any, { ...item, id: null as any })
                              handleAdd()
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <></>
          )}

          <Grid item xs={12} sm={6} lg={4}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => { }}>
              <Grid container sx={{ height: '100%' }}>
                <Grid item xs={5}>
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <img width={65} height={130} alt='add-role' src='/images/cards/pose_m1.png' />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <CardContent>
                    <Box sx={{ textAlign: 'right' }}>
                      <Button
                        variant='contained'
                        sx={{ mb: 3, whiteSpace: 'nowrap' }}
                        onClick={() => {
                          store.get.detail()

                          handleAdd()
                        }}
                      >
                        Add Role
                      </Button>
                      <Typography>Add role, if it doesn't exist.</Typography>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {open ? (
          <RoleCards
            open={open}
            schema={schema}
            describedSchema={describedSchema}
            defaultSchemaValues={defaultSchema}
            setOpen={setOpen}
          />
        ) : (
          <></>
        )}
      </Grid>
      <PageHeader
        title={<Typography variant='h5'>Total users with their roles</Typography>}
        subtitle={
          <Typography variant='body2'>
            Find all of your company’s administrator accounts and their associate roles.
          </Typography>
        }
      />
      <Grid item xs={12}>
        <AdminPage />
        {/* <Table /> */}
      </Grid>
    </Grid>
  )
}

RolesComponent.moduleId = 8

export default RolesComponent
