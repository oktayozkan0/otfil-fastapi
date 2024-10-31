import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderSection } from '../../../components/common/PageHeadSection';
import { HeaderButton } from '../../../models/ui-models/HeaderButton';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { SFModal } from '../../../components/elements/SFModal';
import Flow from '../../../components/edit/Flow';
import { mdlGetScenesRequest } from '../../../models/service-models/scenes/GetScenesRequest';
import { SceneService } from '../../../services/scenes';
import { Scene } from '../../../models/domain/scene';
import { mdlGetChoicesRequest } from '../../../models/service-models/choices/GetChoicesRequest';
import { ChoiceService } from '../../../services/choices';
import { Story } from '../../../models/domain/story';
import { mdlGetStoryRequest } from '../../../models/service-models/stories/GetStoryRequest';
import { StoryService } from '../../../services/stories';
import { StoryDetail } from '../../../components/studio/StoryDetail';
import { mdlDeleteStoryRequest } from '../../../models/service-models/stories/DeleteStoryRequest';
import { toast } from 'react-toastify';
import { Choice } from '../../../models/domain/choice';

const Edit = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [choices, setChoices] = useState<Choice[]>([]);
    const [story, setStory] = useState<Story>();
    const navigate = useNavigate();

    useEffect(() => {
        getStory();
        getScenes();
    }, []);

    const getStory = async () => {
        const request = new mdlGetStoryRequest();
        request.slug = slug;

        const response = await StoryService.Detail(request);
        if (response) {
            setStory(response);
        }
    };

    const getScenes = async () => {
        const request = new mdlGetScenesRequest();
        request.game_slug = slug;

        const response = await SceneService.List(request);
        if (response) {
            const scenesWithChoices = await Promise.all(
                response.items.map(async (scene) => ({
                    ...scene,
                    choices: await getChoices(scene.slug!)
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

    const getChoices = async (scene_slug: string) => {
        const request = new mdlGetChoicesRequest();
        request.story_slug = slug;
        request.scene_slug = scene_slug;

        const response = await ChoiceService.List(request);
        if (response) {
            // Aktif seçimleri filtrele ve geri döndür
            const actives = response.filter(c => c.is_active);
            return actives.length > 0 ? actives : [] as Choice[];
        }
        return [];
    };


    const handleEdit = () => {
        setOpenDetailModal(true);
    };

    const handleDelete = async () => {
        // window.confirm ile kullanıcı onayı alınır
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
        {
            title: t("studio.delete"),
            icon: faTrash,
            fnFunction: handleDelete,
            className: "btn btn-danger btn-dim btn-outline-primary"
        }, {
            title: t("studio.editInfo"),
            icon: faEdit,
            fnFunction: handleEdit,
            className: "btn btn-white btn-dim btn-outline-primary"
        }
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
                    {scenes && story && <Flow choices={choices} scenes={scenes} story={story} callback={() => getScenes()} />}
                </div>
            </div>
            <SFModal
                width={window.innerWidth * 50 / 100}
                open={openDetailModal}
                toggler={() => setOpenDetailModal(!openDetailModal)}
                body={<StoryDetail slug={story?.slug} callback={() => { setOpenDetailModal(false); getStory() }} />}
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

export default Edit;
