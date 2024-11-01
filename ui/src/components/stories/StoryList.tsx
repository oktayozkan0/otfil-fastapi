import React, { useEffect, useState } from 'react'
import { Story } from '../../models/domain/story'
import { mdlGetStoriesRequest } from '../../models/service-models/stories/GetStoriesRequest';
import { StoryService } from '../../services/stories';
import { toUnLoading } from '../../store/SiteSlice';
import { useAppDispatch } from '../../store/Hooks';
import { useTranslation } from 'react-i18next';


export type StoryListProps = {
    studio: boolean;
    restart?: boolean
}


const StoryList = (props: StoryListProps) => {
    const [storyList, setStoryList] = useState<Story[]>([]);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();


    useEffect(() => {
        getStories();
    }, [props.restart]);

    const getStories = async () => {
        var request = new mdlGetStoriesRequest(10, 0);
        var response = await StoryService.List(request);
        if (response != null && response.items != null)
            setStoryList(response.items)
        dispatch(toUnLoading());
    }
    return (
        <div className="game-items w-full">
            {!props.studio && storyList.map((story, index) => (
                <div key={index} className="item">
                    <div className="back">
                        <div className="image-area">
                            <a href={`/story/${story.slug}`} >
                                <img src={`http://localhost:8000${story.img}`} alt={story.title} className="game-image" />
                                <>
                                    <button
                                        key={index}
                                        className="play"
                                    >
                                        <code>{t("story.startStory")}</code>
                                    </button>
                                </>
                            </a>
                        </div>
                    </div>
                    <div className="front">
                        <div className="image-area">
                            <img src={`http://localhost:8000${story.img}`} alt={story.title} className="game-image" />
                            <div className="game-info">
                                {/* <span className="game-match">%99 Match</span>
                                <span className="game-point">3/10</span> */}
                            </div>
                        </div>
                        <div className="info-area">
                            <div className="game-details">
                                <code className="game-name">{story.title}</code>
                            </div>
                            {/* <div className="game-detail-info">
                                <span className="game-author flex gap-2">
                                    <img src={`http://localhost:8000${story.img}`} width="20px" height="20px" className="rounded" />
                                    <span>{"Ömer Süt"}</span>
                                </span>
                                <div className="flex gap-2 justify-beetween">
                                    <span className="game-views">111 oynanma</span>
                                    <span className="game-date"> . 1 gün önce</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            ))}
            {props.studio && storyList.map((story, index) => (
                <div key={index} className="item studio">
                    <div className="back">
                        <div className="image-area">
                            <a href={`/edit/${story.slug}`} >
                                <img src={`http://localhost:8000${story.img}`} alt={story.title} className="game-image" />
                                <>
                                    <button
                                        key={index}
                                        className="play"
                                    >
                                        <code>{t("story.editStory")}</code>
                                    </button>
                                </>
                            </a>
                        </div>
                    </div>
                    <div className="front">
                        <div className="image-area">
                            <div className="game-info">
                            </div>
                        </div>
                        <div className="info-area">
                            <div className="game-details">
                                <code className="game-name">{story.title}</code>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StoryList