import { Formik } from "formik";
import * as Yup from "yup";
import React, { Component } from "react";
class StudentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
        };
   
    }

    render() {
        const { visible, handleClose } = this.props;
        const {
            loading
        } = this.state;

        return visible ? (
            <ModalContainer onClick={handleClose}>
                {loading && (
                    <GlobalLoading
                        containerStyle={{ background: "rgba(000,000,000,0.3)" }}
                        title=""
                    />
                )}
                <div className="p-3">
                <Formik
                            initialValues={{
                                email : "",
                                password : "",
                                name :"",
                                birthday : "",
                                gender : "",
                                phone :"",
                                address: "",
                                max_time : 2
                            }}
                            validationSchema={schema}
                            onSubmit={values => this.handleSubmitAVG(values)}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                setFieldValue,
                                touched,
                                handleSubmit,
                                values,
                                errors
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="rounded-tl-lg rounded-tr-lg p-3 border-b-2 border-gray-300 bg-gray-200 rounded-">
                                        <h6 className="label text-xl">
                                           Add new student
                                        </h6>
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                         <hr className="mt-6 mb-3" />
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                Save
                                            </Button>
                                        </span>
                                        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                                            <Button
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    this.setState({
                                                        modalEditAVG: false
                                                    })
                                                }
                                                backgroundColor="bg-white "
                                                textColor="text-black"
                                                extraClass="border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue "
                                            >
                                                Cancel
                                            </Button>
                                        </span>
                                    </div>
                                </form>
                            )}
                        </Formik>
                  
                </div>
            </ModalContainer>
        ) : null;
    }
}

export default StudentAdd;
