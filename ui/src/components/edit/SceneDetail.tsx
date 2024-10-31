import { memo, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import { mdlGetSceneRequest } from "../../models/service-models/scenes/GetSceneRequest";
import { SceneService } from "../../services/scenes";
import { mdlCreateSceneRequest } from "../../models/service-models/scenes/CreateSceneRequest";
import { mdlUpdateSceneRequest } from "../../models/service-models/scenes/UpdateSceneRequest";
import { ObjectHelper } from "../../utils/ObjectHelper";

export type SceneDetailProps = {
    slug?: string;
    story_slug?: string;
    callback?: Function;
};

export const SceneDetail = function SceneDetail({ slug, story_slug, callback }: SceneDetailProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!slug) {
            form.resetFields(); // Reset form if no slug
        }
    }, [slug, form]);

    const { data, isLoading, isFetched } = useQuery(
        ["getSceneDetail", slug], // Include slug in query key
        () => {
            if (slug) {
                const request: mdlGetSceneRequest = { slug, story_slug };
                return SceneService.Detail(request);
            }
        },
        {
            cacheTime: 0,  // Disable caching
            staleTime: 0,  // Mark data as stale immediately
            refetchOnMount: true, // Refetch on component mount
            refetchOnWindowFocus: true // Refetch on window focus
        }
    );

    useEffect(() => {
        if (data) {
            form.setFieldsValue({ title: data.title, text: data.text });
        }
    }, [data, form]);

    const { mutateAsync: saveScene, isLoading: mutateLoading } = useMutation(
        (data: mdlCreateSceneRequest | mdlUpdateSceneRequest) => {
            return slug
                ? SceneService.Update({ ...data, scene_slug: slug, story_slug } as mdlUpdateSceneRequest)
                : SceneService.Create(data as mdlCreateSceneRequest);
        },
        {
            onError: (error) => {
                console.error("Save error: ", error);
                toast.error(t("common.error")); // Show error message
            },
            onSuccess: (data) => {
                if (data) {
                    toast.success(t("common.success")); // Show success message
                    form.resetFields();
                    callback && callback(); // Call callback if provided
                } else {
                    toast.error(ObjectHelper.getErrorMessage([]));
                }
            },
        }
    );

    return (
        <>
            {!isLoading && ((slug && isFetched) || !slug) && (
                <Spin spinning={mutateLoading}>
                    <Form
                        form={form}
                        initialValues={{ text: data?.text, title: data?.title, type: data?.type }}
                        name="Scene-form"
                        layout="vertical"
                        onFinish={async (values) => saveScene(values)}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={t("stories.title")}
                            name="title"
                            rules={[{ required: true, message: t("common.required") }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ display: 'none' }}
                            label={t("stories.title")}
                            name="type"
                            rules={[{ required: true, message: t("common.required") }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label={t("stories.description")} name="text">
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" htmlType="submit">{t("common.save")}</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Spin>
            )}
        </>
    );
};
