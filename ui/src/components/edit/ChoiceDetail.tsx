import React, { memo, useEffect } from "react";
import { useMutation } from "react-query";
import { Button, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import { ChoiceService } from "../../services/choices";
import { Choice } from "../../models/domain/choice";
import { mdlDeleteChoiceRequest } from "../../models/service-models/choices/DeleteChoiceRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export type ChoiceDetailProps = {
    choice: Choice | null;
    story_slug?: string;
    callback?: Function;
};

export const ChoiceDetail = memo(function ChoiceDetail({ choice, callback, story_slug }: ChoiceDetailProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    React.useEffect(() => {
        console.log(choice)
    }, [])

    // Define a mutation for saving the choice
    const { mutate: saveChoice } = useMutation(ChoiceService.Update, {
        onSuccess: () => {
            toast.success(t("common.saveSuccess"));
            callback && callback();
        },
        onError: () => {
            toast.error(t("common.saveError"));
        },
    });

    // Define a mutation for deleting the choice
    const { mutate: deleteChoice } = useMutation(ChoiceService.Delete, {
        onSuccess: () => {
            toast.success(t("common.deleteSuccess"));
            callback && callback();
        },
        onError: () => {
            toast.error(t("common.deleteError"));
        },
    });

    useEffect(() => {
        if (choice) {
            form.setFieldsValue({ text: choice.text });
        }
    }, [choice, form]);

    const handleDelete = () => {
        if (choice && window.confirm(t("common.confirmDelete"))) {
            const request = new mdlDeleteChoiceRequest()
            request.id = choice.id;
            request.scene_slug = choice.scene_slug;
            request.story_slug = story_slug;
            deleteChoice(request);
        }
    };

    return (
        <Spin spinning={!choice}>
            <Form
                form={form}
                initialValues={{ text: choice?.text }}
                name="Choice-form"
                layout="vertical"
                onFinish={async (values) => saveChoice({ ...choice, text: values.text, story_slug: story_slug })}
                autoComplete="off"
            >
                <Form.Item label={t("stories.description")} name="text">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button className="btn btn-danger btn-dim btn-outline-primary" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} />{t("common.delete")}</Button>
                        <Button type="primary" htmlType="submit">{t("common.save")}</Button>
                    </div>
                </Form.Item>
            </Form>
        </Spin>
    );
});
