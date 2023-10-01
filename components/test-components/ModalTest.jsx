import React, { useState } from "react";

// Custom
import { useHandleMessage, useInput, useSelect } from "hooks"
import { Modal, Button, Spinner, Input, Select } from "components/UI";

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

export default function TableComponent() {
  const handleMessage = useHandleMessage();
  const [submitted, setSubmitted] = useState(false);
  const jobTitle = useSelect("", "select", submitted);
  const cities = useSelect("", "select", submitted);
  const user = useSelect("", "select", submitted);
  const FirstName = useInput("", "number", submitted);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    jobTitle.reset();
    cities.reset();
    FirstName.reset();
    user.reset();
    setSubmitted(false);
    setShowModal(false);
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (jobTitle.value?.value && cities.value && user.value && FirstName.value) {
      setTimeout(() => {
        setSubmitted(false);
        closeModal()
        handleMessage("data saved successfully", "success");
      }, 1000);
    } else {
      setTimeout(() => {
        setSubmitted(false);
      }, 1500);
    }
  }
  return (
    <div className="mb-4">
      <Button onClick={() => setShowModal(true)} >

        show modal
      </Button>
      {showModal && <Modal
        title="test"
        show={showModal}
        footer={false}
        onClose={closeModal}

      >
        <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
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
              <Input required formGroup={false} mandatory={true} label="First Name" {...FirstName.bind} />
            </div>
          </div>

          <div className="flex items-center justify-end p-4 border-t border-solid rounded-b border-slate-200 dark:border-gray-500 dark:bg-gray-800 dark:text-white">
            <Button
              type="button"
            >
              Cancel
            </Button>
            <Button
              className={"ml-4 rtl:mr-4"}
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
      </Modal>}
    </div>
  )
}