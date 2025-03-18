import React, { useState } from "react";
import Modal from "../components/forms/Modal";
import IconButton from "../components/common/buttons/IconButton";
import icons from "../utils/icons";

const example = {
  paginate: true,
  validatePaginate: true,
  className: "example-dialog",
  fieldsetGroups: [
    [
      {
        title: "Fieldset 1",
        paginate: true,
        validatePaginate: true,
        formGroups: [
          [
            {
              title: "Form 1",
              paginate: true,
              validatePaginate: true,
              waitTime: 60,
              onSubmit: (values) => console.log("Form 1 Submitted", values),
              inputGroups: [
                [
                  {
                    name: "field1-page1",
                    type: "text",
                    label: "Field 1 Page 1",
                    required: true,
                    default: "Default Value",
                  },
                  {
                    name: "field2-page1",
                    type: "number",
                    label: "Field 2 Page 1",
                    required: true,
                    min: 0,
                    max: 100,
                    step: 10,
                    default: 60,
                  },
                ],
                [
                  {
                    name: "field1-page2",
                    type: "select",
                    multi: true,
                    searchable: true,
                    label: "Field 1 Page 2",
                    required: true,
                    options: [
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ],
                  },
                ],
              ],
            },
            {
              title: "Form 2",
              paginate: false,
              waitTime: 20,
              onSubmit: (values) => console.log("Form 2 Submitted", values),
              inputGroups: [
                [
                  {
                    name: "field1-form2",
                    type: "radio",
                    label: "Field 1",
                    required: true,
                    options: [
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ],
                  },
                ],
              ],
            },
          ],
          [
            {
              title: "Form 3",
              paginate: false,
              onSubmit: (values) => console.log("Form 3 Submitted", values),
              inputGroups: [
                [
                  {
                    name: "field1-form3",
                    type: "checkbox",
                    label: "Field 1",
                    required: false,
                  },
                ],
              ],
            },
          ],
        ],
      },
      {
        title: "Fieldset 1-2",
        paginate: false,
        formGroups: [
          [
            {
              title: "Form 1-2",
              paginate: false,
              onSubmit: (values) => console.log("Form 1-2 Submitted", values),
              inputGroups: [
                [
                  {
                    name: "field1-2-form1-2",
                    type: "text",
                    label: "Field 1-2",
                    required: false,
                  },
                ],
              ],
            },
            {
              title: "Form 2-2",
              paginate: false,
              onSubmit: (values) => console.log("Form 2-2 Submitted", values),
              inputGroups: [
                [
                  {
                    name: "field1-2-form2-2",
                    type: "text",
                    label: "Field 1-2",
                    required: true,
                  },
                ],
              ],
            },
          ],
        ],
      },
    ],
    [
      {
        title: "Fieldset 2",
        paginate: false,
        formGroups: [
          [
            {
              title: "Form 4",
              paginate: false,
              onSubmit: (values) => console.log("Form 4 Submitted", values),
              inputGroups: [
                [
                  {
                    name: "field1-form4",
                    type: "text",
                    label: "Field 1",
                    required: true,
                  },
                ],
              ],
            },
          ],
        ],
      },
    ],
  ],
};

function Test() {
  const [isOpen, setisOpen] = useState(false);

  const handleOpenModal = () => {
    setisOpen(true);
  };

  const handleCloseModal = () => {
    setisOpen(false);
  };

  return (
    <div>
      <IconButton
        buttonText="Open Modal"
        icon={React.createElement(icons.open)}
        onClick={handleOpenModal}
        className="open-modal"
      />
      <Modal {...example} isOpen={isOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default Test;
