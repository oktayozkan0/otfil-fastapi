import { memo, useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Badge, Button, Flex, Form, Input, Skeleton, Spin } from "antd";
import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";
import { ObjectHelper } from "../../utils/ObjectHelper";
import TextArea from "antd/es/input/TextArea";
import { mdlGetStoryRequest } from "../../models/service-models/stories/GetStoryRequest";
import { StoryService } from "../../services/stories";
import { mdlCreateStoryRequest } from "../../models/service-models/stories/CreateStoryRequest";
import { mdlUpdateStoryRequest } from "../../models/service-models/stories/UpdateStoryRequest";

export type StoryDetailProps = {
    slug?: string;
    callback?: Function;
}


export const StoryDetail = memo(function StoryDetail(props: StoryDetailProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!props.slug && form) {
            form.resetFields(); // ID yoksa formu sıfırla
        }
    }, [props.slug, form]);



    const {
        data,
        isLoading,
        isError,
        isFetched,
        refetch: getStoryDetail
    } = useQuery(
        ["getStoryDetail", props.slug],
        () => {
            if (props.slug) {
                var request: mdlGetStoryRequest = { slug: props.slug };
                return StoryService.Detail(request);
            }
        },
        {
            cacheTime: 0,
            staleTime: 0,
            refetchOnWindowFocus: false,
            enabled: !!props.slug,
        }
    );
    useEffect(() => {
        if (data && form) {
            form.setFieldsValue({ title: data?.title, description: data?.description });
        }
    }, [data, form]);

    const { mutateAsync: saveStory, isLoading: mutateLoading, data: mutateData } = useMutation(
        (data: mdlCreateStoryRequest & mdlUpdateStoryRequest) => props.slug ? StoryService.Update(data as mdlUpdateStoryRequest) : StoryService.Create(data as mdlCreateStoryRequest),
        {
            onMutate(variables) {
                variables.slug = props.slug!
            },
            onError: error => {
                console.log(error);
            },
            onSuccess(data, variables, context) {
                if (data) {
                    toast.success(t("common.success"));
                    form.resetFields();
                    props.callback && props.callback();
                }
                else {
                    toast.error(ObjectHelper.getErrorMessage([]));
                }
            },
        }
    );

    return (
        <>
            {
                !isLoading
                &&
                ((props.slug && isFetched) || !props.slug)
                &&
                <Spin spinning={mutateLoading}>
                    <Form
                        form={form}
                        initialValues={{ description: data?.description, title: data?.title }}
                        name="Story-form"
                        layout="vertical"
                        onFinish={async (values) => saveStory(values)}
                        autoComplete="off"
                    >
                        <Form.Item<mdlUpdateStoryRequest | mdlCreateStoryRequest>
                            label={t("stories.detail.title")}
                            name="title"
                            rules={[{ required: true, message: t("common.required") }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<mdlUpdateStoryRequest | mdlUpdateStoryRequest>
                            label={t("stories.detail.description")}
                            name="description"
                            rules={[{ required: true, message: t("common.required") }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item>
                            <Flex align={"center"} justify="flex-end">
                                <Button type="primary" htmlType="submit">{t("common.save")}</Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                </Spin>
            }
        </>
    )
})
