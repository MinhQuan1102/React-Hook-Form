import React, { useEffect } from 'react';
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date
}

const YoutubeForm = () => {

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: '' }],
      age: 0,
      dob: new Date()
    },
    mode: "onBlur"
  });
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful } = formState;

  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control
  })

  const onSubmit = (data: FormValues) => { 
    console.log(data);
  }

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Errors: " + errors);
  }

  const handleGetValues = () => {
    console.log(getValues(["username"]));
  }

  const handleSetValues = () => {
    setValue("username", '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful])

  // useEffect(() => { 
  //   const subscription = watch((value) => {
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch])

  renderCount++;
  return ( 
    <div>
      <h1>Youtube Form ({renderCount / 2})</h1>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username", {
            required: {
              value: true,
              message: "Username is required!"
            },
          })} />
          <p className='error'>{ errors.username?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" {...register("email", {
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Wrong email format!"
            },
            validate: {
              notAdmin: (fieldValue) => {
                return (
                  fieldValue !== 'admin@example.com' || "Enter a different email address"
                )
              },
              notBlackListed: (fieldValue) => { 
                return (
                  !fieldValue.endsWith("baddomain.com") || "This domain is not supported"
                )
              }, 
              emailAvailable: async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json();
                return data.length == 0 || "Email already exists";
              }
            } 
          })}/>
          <p className='error'>{ errors.email?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Channel</label>
          <input type="text" id="channel" {...register("channel")} />
          <p className='error'>{ errors.channel?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input type="text" id="twitter" {...register("social.twitter", {
            disabled: watch("channel") === ""
          })} />
          <p className='error'>{ errors.channel?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
          <p className='error'>{ errors.channel?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary phone number</label>
          <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
          <p className='error'>{ errors.channel?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary phone number</label>
          <input type="text" id="secondary-phone" {...register("phoneNumbers.1")} />
          <p className='error'>{ errors.channel?.message }</p>
        </div>

        <div className="">
          <label htmlFor="">List of phone numbers</label>
          <div>
            {
              fields.map((field, index) => {
                return <div className='form-control' key={field.id}>
                  <input type="text" {...register(`phNumbers.${index}.number` as const)} />
                  {
                    index > 0 && (
                      <button type='button' onClick={() => remove(index)}>
                        Remove
                      </button>
                    )
                  }
                </div>
              })
            }
            <button type="button" onClick={() => append({ number: ''})}>Add phone number</button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" {...register("age", {
            valueAsNumber: true,
            required: {
              value: true,
              message: "Age is required!"
            }
          })} />
          <p className='error'>{ errors.age?.message }</p>
        </div>

        <div className="form-control">
          <label htmlFor="age">Date of birth</label>
          <input type="date" id="dob" {...register("dob", {
            valueAsDate: true,
            required: {
              value: true,
              message: "Date of birth is required!"
            }
          })} />
          <p className='error'>{ errors.dob?.message }</p>
        </div>
        
        <button type="submit" disabled={!isDirty}>Submit</button>
        <button type="button" onClick={() => reset()}>Reset</button>
        <button type="button" onClick={handleGetValues}>Print values</button>
        <button type="button" onClick={handleSetValues}>Set values</button>
        <button type="button" onClick={() => trigger("username")}>Trigger</button>
      </form>
      <DevTool control={control}/>
    </div>
  )
}

export default YoutubeForm