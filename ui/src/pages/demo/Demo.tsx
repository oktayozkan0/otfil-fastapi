import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { StoryService } from "../../services/stories";
import { Scene } from "../../models/domain/scene";
import { Choice } from "../../models/domain/choice";
import { Story } from "../../models/domain/story";
import { mdlGetScenesRequest } from "../../models/service-models/scenes/GetScenesRequest";
import { mdlDeleteStoryRequest } from "../../models/service-models/stories/DeleteStoryRequest";
import { PageHeaderSection } from "../../components/common/PageHeadSection";
import { SFModal } from "../../components/elements/SFModal";
import { StoryDetail } from "../../components/studio/StoryDetail";
import FlowDemo from "../../components/edit/FlowDemo";


const Demo = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [choices, setChoices] = useState<Choice[]>([]);
    const [story, setStory] = useState<Story>();
    const navigate = useNavigate();

    useEffect(() => {
        getScenes();
    }, []);


    const getScenes = async () => {
        const request = new mdlGetScenesRequest();
        request.game_slug = slug;

        const response = { items: (localStorage.getItem("scenes") ? JSON.parse(localStorage.getItem("scenes")!) : []) as Scene[] }
        if (response) {
            const scenesWithChoices = await Promise.all(
                response.items?.map(async (scene) => ({
                    ...scene,
                    choices: (localStorage.getItem(scene.slug) ? JSON.parse(localStorage.getItem(scene.slug)!) : []) as Choice[]
                }))
            );
            var chcs: Choice[] = [];
            scenesWithChoices.forEach((s) => {
                s.choices.forEach((c) => {
                    chcs.push(c)
                })
            })
            setChoices(chcs)
            setScenes(scenesWithChoices);
        }
    };


    const handleEdit = () => {
        setOpenDetailModal(true);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(t("studio.confirmDelete"));
        if (confirmDelete) {
            const request = new mdlDeleteStoryRequest();
            request.slug = slug;
            const response = await StoryService.Delete(request);
            setTimeout(() => {
                navigate("/studio");
            }, 1000);
        }
    };

    const getButtons = () => [

    ];

    return (
        <div className="nk-content">
            <div className="container-fluid">
                <div className="nk-content-inner">
                    <div className="nk-content-body">
                        <PageHeaderSection
                            pageDescription={story?.description}
                            pageTitle={story?.title}
                            buttons={getButtons()}
                        />
                    </div>
                    {scenes && <FlowDemo choices={choices} scenes={scenes} story={{} as any} callback={() => getScenes()} />}
                </div>
            </div>
            <SFModal
                width={window.innerWidth * 50 / 100}
                open={openDetailModal}
                toggler={() => setOpenDetailModal(!openDetailModal)}
                body={<StoryDetail slug={story?.slug} callback={() => { setOpenDetailModal(false) }} />}
                title={t("studio.story.detailTitle")}
            />
            <style>
                {
                    `.nk-footer { display: none; }`
                }
            </style>
        </div>
    );
};

export default Demo;
