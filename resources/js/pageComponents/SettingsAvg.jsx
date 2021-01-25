import { Formik } from "formik";
import React, { Component } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import ModalContainer from "../components/ModalContaner";
import * as Yup from "yup";
import GlobalLoading from "../components/GlobalLoading";
import ContextWrapper from "../context/ContextWrapper";

const schema = Yup.object({
    group_1: Yup.number()
        .min(0)
        .max(100),
    group_2: Yup.number()
        .min(0)
        .max(100),
    group_3: Yup.number()
        .min(0)
        .max(100),
    group_4: Yup.number()
        .min(0)
        .max(100),
    group_5: Yup.number()
        .min(0)
        .max(100),
    group_6: Yup.number()
        .min(0)
        .max(100),
    group_7: Yup.number()
        .min(0)
        .max(100),
    group_8: Yup.number()
        .min(0)
        .max(100),
    total: Yup.number()
        .min(0)
        .max(100)
});
class SettingAvg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group_1: 0,
            group_2: 0,
            group_3: 0,
            group_4: 0,
            group_5: 0,
            group_6: 0,
            group_7: 0,
            group_8: 0,
            total: 0,
            ready: false,
            loading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    const rs = await window.axios.put(
                        window.baseURL + "/company/setting",
                        {
                            group_1: values.group_1,
                            group_2: values.group_2,
                            group_3: values.group_3,
                            group_4: values.group_4,
                            group_5: values.group_5,
                            group_6: values.group_6,
                            group_7: values.group_7,
                            group_8: values.group_8,
                            total: values.total
                        }
                    );
                    this.props.notify.success();
                } catch (error) {
                    this.props.notify.error();
                }
            }
        );
    }
    componentDidMount() {
        window.axios
            .get(window.baseURL + "/company/setting?ajax=1")
            .then(rs => {
                this.setState({
                    group_1: parseInt(rs.data.group_1_vn_avg.value),
                    group_2: parseInt(rs.data.group_2_vn_avg.value),
                    group_3: parseInt(rs.data.group_3_vn_avg.value),
                    group_4: parseInt(rs.data.group_4_vn_avg.value),
                    group_5: parseInt(rs.data.group_5_vn_avg.value),
                    group_6: parseInt(rs.data.group_6_vn_avg.value),
                    group_7: parseInt(rs.data.group_7_vn_avg.value),
                    group_8: parseInt(rs.data.group_8_vn_avg.value),
                    total: parseInt(rs.data.total.value),
                    ready: true
                });
            });
    }

    render() {
        const { onCancle } = this.props;
        const {
            group_1,
            group_2,
            group_3,
            group_4,
            group_5,
            group_6,
            group_7,
            group_8,
            total,
            ready
        } = this.state;
        return (
            <ModalContainer onClick={onCancle}>
                {ready ? (
                    <Formik
                        initialValues={{
                            group_1: group_1,
                            group_2: group_2,
                            group_3: group_3,
                            group_4: group_4,
                            group_5: group_5,
                            group_6: group_6,
                            group_7: group_7,
                            group_8: group_8,
                            total: total
                        }}
                        validationSchema={schema}
                        onSubmit={values => this.handleSubmit(values)}
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
                            <form onSubmit={handleSubmit} className="p-3">
                                <div className="border-b-2 pb-2 border-blue-700 text-blue-700 font-semibold text-lg">
                                    Setting for Vietnamese Average
                                </div>
                                <div className="grid grid-cols-9 gap-x-3">
                                    <Input
                                        title="Group 1"
                                        name="group_1"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_1}
                                        error={
                                            errors.group_1 && touched.group_1
                                        }
                                    />
                                    <Input
                                        title="Group 2"
                                        name="group_2"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_2}
                                        error={
                                            errors.group_2 && touched.group_2
                                        }
                                    />
                                    <Input
                                        title="Group 3"
                                        name="group_3"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_3}
                                        error={
                                            errors.group_3 && touched.group_3
                                        }
                                    />
                                    <Input
                                        title="Group 4"
                                        name="group_4"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_4}
                                        error={
                                            errors.group_4 && touched.group_4
                                        }
                                    />
                                    <Input
                                        title="Group 5"
                                        name="group_5"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_5}
                                        error={
                                            errors.group_5 && touched.group_5
                                        }
                                    />
                                    <Input
                                        title="Group 6"
                                        name="group_6"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_6}
                                        error={
                                            errors.group_6 && touched.group_6
                                        }
                                    />
                                    <Input
                                        title="Group 7"
                                        name="group_7"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_7}
                                        error={
                                            errors.group_7 && touched.group_7
                                        }
                                    />
                                    <Input
                                        title="Group 8"
                                        name="group_8"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.group_8}
                                        error={
                                            errors.group_8 && touched.group_8
                                        }
                                    />
                                    <Input
                                        title="Total"
                                        name="total"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.total}
                                        error={errors.total && touched.total}
                                    />
                                </div>

                                <div className="mt-6 flex justify-end border-t-2 border-blue-700 pt-3">
                                    <Button type="submit">Save</Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <GlobalLoading />
                )}
            </ModalContainer>
        );
    }
}

export default ContextWrapper(SettingAvg);
