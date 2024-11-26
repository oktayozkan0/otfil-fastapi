import { memo, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Form, Input, Modal, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import { RcFile } from "antd/lib/upload";
import { mdlGetStoryRequest } from "../../models/service-models/stories/GetStoryRequest";
import { StoryService } from "../../services/stories";
import { mdlCreateStoryRequest } from "../../models/service-models/stories/CreateStoryRequest";
import { mdlUpdateStoryRequest } from "../../models/service-models/stories/UpdateStoryRequest";
import { mdlImageUploadRequest } from "../../models/service-models/image/ImageUploadRequest";
import { getCroppedImg } from "../../utils/cropImage";
import TextArea from "antd/es/input/TextArea";

export type StoryDetailProps = {
    slug?: string;
    callback?: Function;
};

export const StoryDetail = memo(function StoryDetail(props: StoryDetailProps) {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [cropModalVisible, setCropModalVisible] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | any>(null);

    useEffect(() => {
        if (!props.slug && form) {
            form.resetFields();
        }
    }, [props.slug, form]);

    const { data, isLoading, isFetched } = useQuery(
        ["getStoryDetail", props.slug],
        () => {
            if (props.slug) {
                const request: mdlGetStoryRequest = { slug: props.slug };
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

    const { mutateAsync: saveStory, isLoading: mutateLoading } = useMutation(
        (data: mdlCreateStoryRequest & mdlUpdateStoryRequest) =>
            props.slug
                ? StoryService.Update(data as mdlUpdateStoryRequest)
                : StoryService.Create(data as mdlCreateStoryRequest),
        {
            onError: (error) => {
                console.log(error);
                toast.error("An error occurred while saving the story.");
            },
            onSuccess: async (data) => {
                if (data && data.slug) {
                    toast.success("Story saved successfully.");
                    if (imageFile) {
                        uploadCroppedImage(data.slug);
                    }
                }
            },
        }
    );

    const handleImageUpload = (file: RcFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setPreviewImage(e.target.result as string);
                setCropModalVisible(true);
            }
        };
        reader.readAsDataURL(file);
        setImageFile(file);
        return false; // Prevent automatic upload
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const uploadCroppedImage = async (storySlug: string) => {
        if (!imageFile || !croppedAreaPixels || !previewImage) return;

        try {
            const croppedBlob = await getCroppedImg(previewImage, croppedAreaPixels);
            const formData = new FormData();
            formData.append("image", croppedBlob);

            const request: mdlImageUploadRequest = {
                image: formData,
                story_slug: storySlug,
            };

            await StoryService.ImageUpload(request);
            toast.success("Image uploaded successfully.");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Error uploading the image.");
        }
    };

    const handleCropConfirm = async () => {
        setCropModalVisible(false);
    };

    return (
        <>
            {!isLoading && ((props.slug && isFetched) || !props.slug) && (
                <Spin spinning={mutateLoading}>
                    <Form
                        form={form}
                        initialValues={{ description: data?.description, title: data?.title }}
                        name="Story-form"
                        layout="vertical"
                        onFinish={(values) => saveStory(values)}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: "Title is required." }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: "Description is required." }]}>
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item label="Upload Image">
                            <Upload beforeUpload={handleImageUpload} maxCount={1} accept="image/jpeg, image/png, image/gif">
                                <Button icon={<UploadOutlined />}>Select Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            )}

            <Modal
                visible={cropModalVisible}
                onCancel={() => setCropModalVisible(false)}
                onOk={handleCropConfirm}
                title="Crop Image"
                okText="Crop & Save"
            >
                <div style={{ position: "relative", width: "100%", height: 400 }}>
                    {previewImage && (
                        <Cropper
                            image={previewImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={16 / 9}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
});
