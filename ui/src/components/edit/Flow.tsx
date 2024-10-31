import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    Connection,
    Edge,
    Node,
    useEdgesState,
    useNodesState,
    Position,
    MarkerType,
} from 'react-flow-renderer';
import { Scene } from '../../models/domain/scene';
import { enmSceneType } from '../../models/enums/sceneType';
import { mdlUpdateSceneRequest } from '../../models/service-models/scenes/UpdateSceneRequest';
import { SceneService } from '../../services/scenes';
import { Story } from '../../models/domain/story';
import { SFModal } from '../elements/SFModal';
import { mdlDeleteSceneRequest } from '../../models/service-models/scenes/DeleteSceneRequest';
import { mdlCreateSceneRequest } from '../../models/service-models/scenes/CreateSceneRequest';
import { SceneDetail } from './SceneDetail';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChoiceService } from '../../services/choices';
import { mdlCreateChoiceRequest } from '../../models/service-models/choices/CreateChoiceRequest';
import { toast } from 'react-toastify';
import { ChoiceDetail } from './ChoiceDetail';
import { Choice } from '../../models/domain/choice';
import './Flow.css'; // Import the CSS file
import { useTranslation } from 'react-i18next';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type FlowProps = {
    scenes: Scene[];
    choices: Choice[];
    story: Story;
    callback: Function;
};

const Flow: React.FC<FlowProps> = ({ scenes, story, callback, choices }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
    const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
    const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
    const [beginningNodeAdded, setBeginningNodeAdded] = useState(false);
    const [isBeginningNodeExists, setIsBeginningNodeExists] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const sceneNodes = scenes.map((scene) => ({
            id: scene.slug,
            data: {
                label: (
                    <div
                        className={`node-container ${scene.type === enmSceneType.BEGINNING ? 'beginning' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScene(scene);
                            setModalOpen(true);
                        }}
                    >
                        <span className="node-title">{scene.title}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemoveNode(scene.slug); }}
                            className="node-button node-button-delete"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button className="node-button node-button-edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </div>
                ),
            },
            position: { x: scene.x, y: scene.y },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            type: scene.type === enmSceneType.BEGINNING ? 'input' : 'default',
        }));

        const sceneEdges = scenes.flatMap((scene) =>
            scene.choices.map((choice) => ({
                id: choice.id.toString(),
                source: choice.scene_slug,
                target: choice.next_scene_slug,
                label: choice.text,
                style: { stroke: '#888' },
                type: "custom",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 40,
                    height: 40,
                    color: '#000',
                },
            }))
        );

        setNodes(sceneNodes);
        setEdges(sceneEdges);

        const beginningNodeExists = sceneNodes.some(node => node.type === 'input');
        setIsBeginningNodeExists(beginningNodeExists);
    }, [scenes, setNodes, setEdges, choices]);

    const onConnect = useCallback(
        async (connection: Connection) => {
            const request = new mdlCreateChoiceRequest(connection.source!, story.slug, "choice", connection.target!);
            const response = await ChoiceService.Create(request);
            if (response.is_active) {
                toast.success("Choice created successfully");
                setEdges((eds) => addEdge(connection, eds));
                callback?.();
            }
        },
        [callback, story.slug]
    );

    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        const findScene = scenes.find(s => s.slug === edge.source);
        const findChoice = findScene?.choices.find(c => c.id === Number(edge.id));
        if (findChoice != null) {
            setSelectedChoice(findChoice);
            setIsChoiceModalOpen(true);
        }
    }, [scenes]);

    const onRemoveNode = useCallback(
        async (nodeId: string) => {
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
            const request = new mdlDeleteSceneRequest();
            request.story_slug = story.slug;
            request.scene_slug = nodeId;
            await SceneService.Delete(request);
            callback?.();
        },
        [setNodes, setEdges, callback, story.slug]
    );

    const onNodeDragStop = useCallback(async (event: React.MouseEvent, node: Node) => {
        const scene = scenes.find(s => s.slug === node.id);
        if (scene) {
            const request = new mdlUpdateSceneRequest();
            request.scene_slug = node.id;
            request.story_slug = story.slug;
            request.x = node.position.x;
            request.y = node.position.y;
            request.text = scene.text;
            request.title = scene.title;
            request.type = scene.type;
            await SceneService.Update(request);
        }
    }, [scenes, story.slug]);

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const type = event.dataTransfer.getData("type");

        const containerRect = containerRef.current?.getBoundingClientRect();
        const x = event.clientX - (containerRect?.left! || 0);
        const y = event.clientY - (containerRect?.top! || 0);

        const newNode = {
            id: type === "beginning" ? `beginning-${Date.now()}` : `default-${Date.now()}`,
            data: { label: <div>{type === "beginning" ? "Beginning Node" : "Default Node"}</div> },
            position: { x, y },
            type: type === "beginning" ? 'input' : 'default',
        };

        setNodes((nds) => [...nds, newNode]);

        const request = new mdlCreateSceneRequest();
        request.title = "New Scene";
        request.text = "Scene details...";
        request.x = x;
        request.story_slug = story.slug;
        request.y = y;
        request.type = type as enmSceneType;

        await SceneService.Create(request);
        callback?.();
    };

    return (
        <div
            className="flow-container"
            ref={containerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div className="flow-header">
                <button
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("type", "beginning")}
                    className={`flow-button flow-button-beginning ${isBeginningNodeExists ? 'disabled' : ''}`}
                    disabled={isBeginningNodeExists}
                >
                    {t("flow.beginning")}
                </button>
                <button
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("type", "default")}
                    className="flow-button flow-button-default"
                >
                    {t("flow.default")}
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={onEdgeClick}
                onNodeDragStop={onNodeDragStop}
                fitView
                className="touch-flow"
            >
                <Background color="#ddd" gap={16} />
                <Controls />
            </ReactFlow>

            {isModalOpen && (
                <SFModal
                    width={window.innerWidth * 50 / 100}
                    open={isModalOpen}
                    toggler={() => { setModalOpen(!isModalOpen); }}
                    body={
                        <SceneDetail
                            callback={() => { setModalOpen(false); callback?.(); setSelectedScene(null); }}
                            story_slug={story.slug}
                            slug={selectedScene?.slug}
                        />
                    }
                    title={t("flow.sceneDetails")}
                />
            )}
            {isChoiceModalOpen && (
                <SFModal
                    width={window.innerWidth * 50 / 100}
                    open={isChoiceModalOpen}
                    toggler={() => { setIsChoiceModalOpen(!isChoiceModalOpen); }}
                    body={
                        <ChoiceDetail
                            callback={() => { setIsChoiceModalOpen(false); callback?.(); setSelectedChoice(null); }}
                            story_slug={story.slug}
                            choice={selectedChoice}
                        />
                    }
                    title={t("flow.choiceDetails")}
                />
            )}
        </div>
    );
};

export default Flow;
