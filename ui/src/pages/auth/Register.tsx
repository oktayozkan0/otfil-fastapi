import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/Hooks";
import { routeContants } from "../../utils/RouteConstants";
import Footer from "../../layout/Footer";
import { HtmlHelper } from "../../utils/HtmlHelper";
import { Button, Flex, Form, Input } from "antd";
import { setToken, setUser, toLoading, toUnLoading } from "../../store/SiteSlice";
import { AuthService } from "../../services/auth";
import { toast } from "react-toastify";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { useMutation } from "react-query";
import { mdlMeRequest } from "../../models/service-models/auth/MeRequest";
import { Logo } from "../../components/common/Logo";
import { mdlSignupRequest } from "../../models/service-models/auth/SignupRequest";

const Register = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm<mdlSignupRequest>();

    useEffect(() => {
        HtmlHelper.removeBodyClass("has-sidebar");
        HtmlHelper.addBodyClass("pg-auth");
    }, []);

    const { mutateAsync, isLoading } = useMutation(
        (data: mdlSignupRequest) => AuthService.SignUp(data),
        {
            onMutate() {
                dispatch(toLoading());
            },
            onError(error) {
                console.error(error);
                toast.error(ObjectHelper.getErrorMessage([{ message: "Failed" }]));
                dispatch(toUnLoading());
            },
            onSuccess(data) {
                dispatch(toUnLoading());
                if (data) {
                    toast.success(t("login.registrationSuccess"));
                    navigate(routeContants.LOGIN);
                } else {
                    toast.error(ObjectHelper.getErrorMessage([{ message: "Failed" }]));
                }
            },
        }
    );

    const onFinish = async (values: mdlSignupRequest) => {
        await mutateAsync(values);
    };

    return (
        <div className="nk-app-root">
            <div className="nk-main">
                <div className="nk-wrap nk-wrap-nosidebar">
                    <div className="nk-content">
                        <div className="nk-block nk-block-middle nk-auth-body wide-xs">
                            <div className="brand-logo pb-4 text-center">
                                {/* Optionally include a logo here */}
                            </div>
                            <div className="card card-bordered">
                                <div className="card-inner card-inner-lg">
                                    <div className="nk-block-head">
                                        <div className="nk-block-head-content">
                                            <h4 className="nk-block-title">{t("login.register")}</h4>
                                        </div>
                                    </div>

                                    <Form
                                        form={form}
                                        initialValues={{ username: "", password: "" }}
                                        name="login-form"
                                        layout="vertical"
                                        onFinish={onFinish}
                                        autoComplete="off"
                                    >
                                        <Form.Item<mdlSignupRequest>
                                            label={t("login.firstName")}
                                            name="first_name"
                                            rules={[{ required: true, message: t("common.required") }]}
                                        >
                                            <Input placeholder={t("login.username")} />
                                        </Form.Item>
                                        <Form.Item<mdlSignupRequest>
                                            label={t("login.lastName")}
                                            name="last_name"
                                            rules={[{ required: true, message: t("common.required") }]}
                                        >
                                            <Input placeholder={t("login.username")} />
                                        </Form.Item>
                                        <Form.Item<mdlSignupRequest>
                                            label={t("login.email")}
                                            name="email"
                                            rules={[
                                                { required: true, message: t("common.required") },
                                                {
                                                    type: "email",
                                                    message: t("login.invalidEmail") || "Invalid email format",
                                                },
                                            ]}
                                        >
                                            <Input placeholder={t("login.email")} />
                                        </Form.Item>

                                        <Form.Item<mdlSignupRequest>
                                            label={t("login.username")}
                                            name="username"
                                            rules={[{ required: true, message: t("common.required") }]}
                                        >
                                            <Input placeholder={t("login.username")} />
                                        </Form.Item>
                                        <Form.Item<mdlSignupRequest>
                                            label={t("login.passCode")}
                                            name="password"
                                            rules={[
                                                { required: true, message: t("common.required") },
                                                { min: 8, message: t("login.notValidPassword") }
                                            ]}
                                        >
                                            <Input.Password placeholder={t("login.passCode")} />
                                        </Form.Item>

                                        <Form.Item>
                                            <Flex align="center" justify="flex-end">
                                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                                    {t("login.signIn")}
                                                </Button>
                                            </Flex>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>
                {`
                    .nk-header {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                    }
                    .nk-footer {
                        display: none;
                    }
                `}
            </style>
        </div>
    );
};

export default Register;
