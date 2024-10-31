import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/Hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { mdlGetStoryRequest } from '../../models/service-models/stories/GetStoryRequest';
import { StoryService } from '../../services/stories';
import { toUnLoading } from '../../store/SiteSlice';
import { Story } from '../../models/domain/story';
import { Scene } from '../../models/domain/scene';
import { mdlGetScenesRequest } from '../../models/service-models/scenes/GetScenesRequest';
import { SceneService } from '../../services/scenes';
import { mdlGetChoicesRequest } from '../../models/service-models/choices/GetChoicesRequest';
import { ChoiceService } from '../../services/choices';
import { Choice } from '../../models/domain/choice';
import { enmSceneType } from '../../models/enums/sceneType';
import { Button, Card, Space } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';

const StoryPage = () => {
    const [story, setStory] = useState<Story>();
    const [scenes, setScenes] = useState<Scene[]>();
    const dispatch = useAppDispatch();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [choices, setChoices] = useState<Choice[]>([]);
    const [activeScene, setActiveScene] = useState<Scene>();

    useEffect(() => {
        getStory();
    }, [slug]);

    const getStory = async () => {
        const request = new mdlGetStoryRequest();
        request.slug = slug;
        const response = await StoryService.Detail(request);
        if (response) {
            setStory(response);
            getScenes();
        }
        dispatch(toUnLoading());
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
            let chcs: Choice[] = [];
            scenesWithChoices.forEach((s) => {
                s.choices.forEach((c) => chcs.push(c));
            });
            setChoices(chcs);
            setScenes(scenesWithChoices);
            setActiveScene(scenesWithChoices.find(s => s.type === enmSceneType.BEGINNING));
        }
    };

    const getChoices = async (scene_slug: string) => {
        const request = new mdlGetChoicesRequest();
        request.story_slug = slug;
        request.scene_slug = scene_slug;
        const response = await ChoiceService.List(request);
        return response ? response.filter(c => c.is_active) : [];
    };

    return (
        <div style={{
            backgroundColor: '#1a1a1d',
            color: '#fff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <button
                onClick={() => navigate('/')} // Anasayfaya yönlendirir
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#ff4757',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff6b81')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff4757')}
            >
                <FontAwesomeIcon icon={faBackward} /> Stories
            </button>
            {activeScene && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url('http://localhost:8000${activeScene.img}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(5px)',
                        zIndex: 1,
                    }} />
                    <Card
                        style={{
                            color: '#fff',
                            maxWidth: '600px',
                            width: '90%',
                            textAlign: 'center',
                            margin: '20px',
                            zIndex: 2,
                        }}
                        cover={<img src={`http://localhost:8000${activeScene.img}`} alt="scene" style={{ maxHeight: '300px', objectFit: 'cover' }} />}
                    >
                        <Card.Meta title={activeScene.text} />
                    </Card>
                    <Space direction="vertical" style={{ width: '100%', maxWidth: '600px', zIndex: 2 }}>
                        {activeScene.choices.map((choice, index) => (
                            <Button
                                key={index}
                                type="primary"
                                size="large"
                                block
                                onClick={() => setActiveScene(scenes?.find(s => s.slug === choice.next_scene_slug))}
                                style={{
                                    backgroundColor: '#7289da',
                                    borderColor: '#7289da',
                                    marginBottom: '10px',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {choice.text}
                            </Button>
                        ))}
                    </Space>
                </>
            )}
            <style>
                {
                    `.nk-footer { display: none; }
                    .nk-header { display: none; }`
                }
            </style>
        </div>
    );
};

export default StoryPage;
