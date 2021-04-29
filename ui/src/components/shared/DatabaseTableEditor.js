import React, { useState } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Modal } from "semantic-ui-react";
import { config } from "../util/constants";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

export default function DatabaseTableEditor(props) {
    let initialState = props.initialState;
    let submissionModalMessages = props.submissionModalMessages;
    let submitRoute = props.submitRoute;
    let formFieldArray = props.formFieldArray;
    let options = props?.options || null;

    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);
    const [formData, setFormData] = useState(initialState);

    let semesterMap = {};

    for (let i = 0; i < props.semesterData.length; i++) {
        const semester = props.semesterData[i];
        semesterMap[semester.semester_id] = semester.name;
    }

    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: submissionModalMessages["SUCCESS"],
                    actions: [{ header: "Success!", content: "Done", positive: true, key: 0 }],
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content: submissionModalMessages["SUCCESS"],
                    actions: [{ header: "There was an issue", content: "Keep editing...", positive: true, key: 0 }],
                };
            default:
                return;
        }
    };

    const closeSubmissionModal = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                break;
            case MODAL_STATUS.FAIL:
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                break;
            default:
                console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
        }
    };

    const handleSubmit = async function (e) {
        let body = new FormData();

        Object.keys(formData).forEach((key) => {
            body.append(key, formData[key]);
        });

        //console.log("formData: ", formData);

        fetch(submitRoute, {
            method: "post",
            body: body,
        })
            .then((response) => {
                if (response.status === 200) {
                    setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
                } else {
                    setSubmissionModalOpen(MODAL_STATUS.FAIL);
                }
            })
            .catch((error) => {
                // TODO: handle errors
                alert("Error with submission, check logs");
                console.log(error);
                console.error(error);
            });
    };

    const handleChange = (e, { name, value, checked }) => {

        if (checked) {
            value = checked;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    let fieldComponents = [];
    for (let i = 0; i < formFieldArray.length; i++) {
        let field = formFieldArray[i];
        switch (field.type) {
            case "input":
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <Form.Input
                            label={field.label}
                            placeholder={field.placeholder}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            case "date":
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <Form.Input
                            label={field.label}
                            type="date"
                            placeholder={field.placeholder}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            case "textArea":
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <Form.TextArea
                            placeholder={field.placeholder}
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            style={{ minHeight: 200 }}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            case "dropdown"://this needs to be fixed to be completely free of hard coding. Mapping semesters needs to happen as a parameter
                let options = Object.keys(semesterMap).map((semester_id, idx) => {
                    return { key: idx, text: semesterMap[semester_id], value: semester_id };
                });
                if(field.options) {
                    options = props.options
                }

                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <label>{field.label}</label>

                        <Dropdown
                            selection
                            options={options}
                            loading={props.semesterData.loading}
                            disabled={props.semesterData.loading}
                            value={formData[field.name].toString()}
                            name={field.name}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;

            case "checkbox":
                fieldComponents.push(
                    <Form.Field key={field["name"]}>
                        <Form.Checkbox
                            label={field["label"]}
                            checked={!!formData[field["name"]]}
                            name={field["name"]}
                            onChange={handleChange}
                        />
                    </Form.Field>
                )
                break;

            default:
                break;
        }
    }

    function checkIfEmpty() {
        if (props.submitRoute == config.url.API_POST_CREATE_USER) {
            return <Button icon="plus" />;
        }
        else {
            return <Button icon="edit" />;
        }
    }

    return (
        <>
            <Modal
                trigger={checkIfEmpty()}
                header={props.header}
                content={{ content: <Form>{fieldComponents}</Form> }}
                actions={[
                    {
                        key: "submit",
                        content: "Submit",
                        onClick: (event) => handleSubmit(event),
                        positive: true,
                    },
                ]}
            />
            <Modal open={!!submissionModalOpen} {...generateModalFields()} onClose={() => closeSubmissionModal()} />
        </>
    );
}
