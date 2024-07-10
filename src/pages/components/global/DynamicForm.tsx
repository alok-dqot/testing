import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { Autocomplete, Button, FormControl, FormHelperText, Grid, TextField } from '@mui/material'
import { format } from 'date-fns'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

// ** Third party imports
import * as yup from 'yup'

const demoSchema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required()
})

type Props = {
  schema?: yup.ObjectSchema<Record<string, any>>
}

export const inputType: Record<string, string> = {
  string: 'text',
  email: 'email',
  number: 'number',
  date: 'date',
  'datetime-local': 'datetime-local'
}

const DynamicForm = ({ schema = demoSchema }: Props) => {
  const describedSchema = schema.describe()
  const fields = Object.keys(describedSchema.fields)
  const defaultValues = schema.getDefault()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    getFieldState,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  return (
    <>
      {fields.map(fieldName => {
        // ** Get Field
        const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
        if (field?.meta?.hidden) {
          return <></>
        }
        /**
         * Label given in the schema
         * @example { yup.string().label("Name") }
         **/
        let label = field.label
        if (!label) {
          label = fieldName.replaceAll('_', ' ')
          label = label.charAt(0).toUpperCase() + label.slice(1)
        }

        /**
         * Type given in the schema
         * @example { yup.string().label("Name").meta({type:"file"}) }
         **/
        let type = inputType[field.type]
        if (field.meta?.type === 'file') {
          type = field.meta?.type
        }
        if (type == 'date' && field.meta?.type) {
          type = field.meta?.type
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
          <>
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
                          <>
                            {/* <InputLabel id={`user-view-${fieldName}`}>{label}</InputLabel> */}

                            <Autocomplete
                              options={[...field.oneOf]}
                              onChange={(e, value: any) => {
                                console.log('value: ', value)
                                console.log('typeof value : ', typeof value === 'object')
                                // onChange(value)
                                setValue(fieldName as any, (typeof value === 'object' ? value?.value : value) as any)
                              }}
                              getOptionLabel={(option: any) => (typeof option == 'object' ? option.label : option)}
                              value={
                                field.oneOf.find((f: any) => {
                                  return f.value == value
                                }) || value
                              }
                              renderInput={params => {
                                return <TextField {...params} label={label} />
                              }}
                            />
                          </>
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
                                console.log('type is datetime-local')
                                console.log(
                                  'format(new Date(e.target.value), ): ',
                                  format(new Date(e.target.value), 'yyyy-MM-dd HH:mm:ss')
                                )
                                setValue(fieldName as any, format(new Date(e.target.value), 'yyyy-MM-dd HH:mm:ss'))
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
          </>
        )
      })}
    </>
  )
}

export default DynamicForm
