import React, { useState } from 'react'
import { useEffect } from "react";
import { useAppDispatch } from "../../store/Hooks";
import { toUnLoading } from "../../store/SiteSlice";
import { useTranslation } from "react-i18next";
import { PageHeaderSection } from "../../components/common/PageHeadSection";
import { Story } from '../../models/domain/story';
import { mdlGetStoriesRequest } from '../../models/service-models/stories/GetStoriesRequest';
import { StoryService } from '../../services/stories';
import { HeaderButton } from '../../models/ui-models/HeaderButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { SFModal } from '../../components/elements/SFModal';
import StoryList from '../../components/stories/StoryList';
import { StoryDetail } from '../../components/studio/StoryDetail';

const Studio = () => {
    const { t } = useTranslation();
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [restart, setRestart] = useState<boolean>(false);

    const [selectedStory, setSelectedStory] = useState<Story>();

    const handleAddNew = () => {
        setSelectedStory(undefined);
        setOpenDetailModal(true);
    }

    const getButtons = () => {
        let _buttons: HeaderButton[] = [];
        _buttons.push({
            title: t("studio.addNew"),
            icon: faPlus,
            fnFunction: handleAddNew,
            className: "btn btn-white btn-dim btn-outline-primary"
        });
        return _buttons
    }
    return (
        <div className="nk-content ">
            <div className="container-fluid">
                <div className="nk-content-inner">
                    <div className="nk-content-body">
                        <PageHeaderSection
                            pageDescription={t("studio.description")}
                            pageTitle={t("studio.title")}
                            buttons={getButtons()}
                        />
                    </div>
                    <StoryList studio={true} restart={restart} />

                </div>
            </div>
            <SFModal
                width={window.innerWidth * 50 / 100}
                open={openDetailModal}
                toggler={() => { setOpenDetailModal(!openDetailModal) }}
                body={<StoryDetail slug={selectedStory?.slug} callback={() => { setOpenDetailModal(false); setRestart(!restart) }} />}
                title={t("studio.story.detailTitle")}
            />
        </div>
    )
}

export default Studio