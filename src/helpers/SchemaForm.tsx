import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, FormHelperText, Button } from "@mui/material";
import { constants } from "buffer";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { inputType } from "src/context/types";
import * as yup from 'yup';


interface FieldOption {
  value: string | number;
  label: string;
}

interface FieldSchema {
  label: string;
  type: string;
  meta?: {
    hidden?: boolean;
    type?: string;
    key?: string;
  };
  oneOf?: FieldOption[];
}


interface SchemaFormProps {
  describedSchema: yup.SchemaObjectDescription;
  defaultValues?: Record<string, any>;
  onSubmit: SubmitHandler<any>;
}





const SchemaForm: React.FC<SchemaFormProps> = ({ describedSchema, onSubmit, defaultValues }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <>

      <form>
        <Grid container spacing={6}>
          {Object.keys(describedSchema?.fields).map(fieldName => {
            const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
            if (field?.meta?.hidden) {
              return <></>
            }

            const label = field.label
            let type = inputType[field.type]

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
            if (field.meta?.type) {
              type = field.meta?.type
            }

            return (
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Controller
                    name={fieldName as any}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      if (field.meta?.type == 'select') {
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
                          error={!!(errors as any)[fieldName]}
                          helperText={(errors as any)[fieldName]?.message}
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
          <Grid item xs={6} md={6}>
            <Button variant='contained' sx={{ mt: 4, ml: 'auto' }} onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          </Grid>

        </Grid>
      </form>
    </>
  )
}


export default SchemaForm;
