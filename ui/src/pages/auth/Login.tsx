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
import { mdlLoginRequest } from "../../models/service-models/auth/LoginRequest";
import { mdlMeRequest } from "../../models/service-models/auth/MeRequest";
import { Logo } from "../../components/common/Logo";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm<mdlLoginRequest>();

  useEffect(() => {
    HtmlHelper.removeBodyClass("has-sidebar");
    HtmlHelper.addBodyClass("pg-auth");
  }, []);

  const { mutateAsync, isLoading, data } = useMutation(
    (data: mdlLoginRequest) => AuthService.Login(data),
    {
      onMutate(variables) {
        dispatch(toLoading());
      },
      onError: error => {
        console.log(error);
      },
      onSuccess(data, variables, context) {
        if (data.access_token) {
          dispatch(setToken(data.access_token));
          getMe();
        } else {
          dispatch(toUnLoading());
          toast.error(ObjectHelper.getErrorMessage([{ message: "Failed" }]));
        }
      },
    }
  );

  const getMe = async () => {
    var request = new mdlMeRequest();
    var response = await AuthService.Me(request);
    if (response != null) {
      dispatch(setUser(response));
      navigate(routeContants.STORIES);
    }
  }

  return (
    <div className="nk-app-root">
      <div className="nk-main ">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content ">
            <div className="nk-block nk-block-middle nk-auth-body wide-xs">
              <div className="brand-logo pb-4 text-center">
                {/* Optionally add your logo here */}
              </div>
              <div className="card card-bordered">
                <div className="card-inner card-inner-lg">
                  <div className="nk-block-head">
                    <div className="nk-block-head-content">
                      {/* <Logo /> */}
                      <h4 className="nk-block-title">{t("login.signIn")}</h4>
                    </div>
                  </div>
                  <Form
                    initialValues={{ mail: "", password: "" }}
                    name="login-form"
                    layout="vertical"
                    onFinish={async (values) => await mutateAsync(values)}
                    autoComplete="off"
                  >
                    <Form.Item<mdlLoginRequest>
                      label={t("login.username")}
                      name="username"
                      rules={[{ required: true, message: t("common.required") }]}
                    >
                      <Input placeholder={t("login.username")} />
                    </Form.Item>
                    <Form.Item<mdlLoginRequest>
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
                      <Flex align={"center"} justify="flex-end">
                        <Button type="primary" htmlType="submit">{t("login.signIn")}</Button>
                        {/* <Button type="link">{t("login.forgotPassword")}</Button> */}
                      </Flex>
                    </Form.Item>
                  </Form>
                  {/* Register Banner */}
                  <Flex justify="center" className="mt-2">
                    <span>
                      {t("login.notAMember")}{" "}
                      <Button type="link" onClick={() => navigate('/register')}>
                        {t("login.register")}
                      </Button>
                    </span>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
         .nk-header {
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
         }
         .nk-footer { display: none }
        `}
      </style>
    </div>
  );
};

export default Login;
