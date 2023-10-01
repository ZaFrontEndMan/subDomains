import React, { useEffect, useState } from "react";

// Custom
import { useInput, useSelect } from "hooks"
import { Button, Spinner, Input, Select } from "components/UI";

const options = [
  {
    label: "Front-end Developer",
    value: 1
  },
  {
    label: "back-end Developer",
    value: 2
  },
  {
    label: "full-stack Developer",
    value: 3
  },
  {
    label: "Web3 Developer",
    value: 4
  }
]

export default function InputSelectBoxes() {
  const [submitted, setSubmitted] = useState(false);
  const jobTitle = useSelect("", "select", submitted);
  const cities = useSelect("", "select", submitted);
  const user = useSelect("", "select", submitted);
  const FirstName = useInput("", "number", submitted);

  const UsersSearch = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    } else {
      fetch(`https://jsonplaceholder.typicode.com/posts/${inputValue}`)
        .then(response => response.json())
        .then((data) => {
          if (!Object.keys(data)?.length) {
            return callback([]);
          }
          return callback([data]?.map(c => {
            return {
              ...c,
              value: c.id,
              label: `${c?.title?.slice(0, 5)}`
            }
          }));
        });
    }
  };

  useEffect(() => {
    if (user.value) {
      // user.reset();
    }
  }, [user.value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="">
          <Select
            mandatory
            label={"Job Title"}
            placeholder={"Select One"}
            options={options}
            {...jobTitle.bind}
          />
        </div>
        <div className="">
          <Select
            mandatory
            isMulti
            label={"Cities"}
            autoHeight
            placeholder={"Select One"}
            options={options}
            {...cities.bind}
          />
        </div>
        <div className="">
          <Select
            mandatory
            label={"Cities"}
            placeholder={"Select One"}
            async={true}
            // getOptionLabel={(option) => option.label}
            // getOptionValue={(option) => option.id}
            loadOptions={UsersSearch}
            isDisabled={false}
            isOptionDisabled={(options) => options.id == 3}
            {...user.bind}
          />
        </div>
        <div className="">
          <Input formGroup={false} mandatory={true} label="First Name" {...FirstName.bind} />
        </div>
      </div>

      <div className='flex items-center justify-between px-2 ml-auto rtl:mr-auto rtl:ml-0 w-80 '>

        <Button
          className="bg-white border border-gray-300 rounded-lg w-36 hover:bg-gray-300 hover:text-white "
          type="button"
        >
          <span className='text-black '>Cancel</span>
        </Button>
        <Button
          className="w-36 rounded-xl "
          type="submit"
        >

          {submitted ? (
            <>
              <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
              loading
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>


    </form>
  )
}