import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Pagination, Spin, message } from 'antd';
import { Story } from '../../models/domain/story';
import { mdlGetStoriesRequest } from '../../models/service-models/stories/GetStoriesRequest';
import { StoryService } from '../../services/stories';
import { useTranslation } from 'react-i18next';

const { Meta } = Card;

export type StoryListProps = {
    studio: boolean;
};

const StoryList = ({ studio }: StoryListProps) => {
    const [storyList, setStoryList] = useState<Story[]>([]);
    const [totalStories, setTotalStories] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const pageSize = 10;

    useEffect(() => {
        fetchStories(currentPage, pageSize);
    }, [currentPage]);

    const fetchStories = async (page: number, pageSize: number) => {
        setLoading(true);
        const request = new mdlGetStoriesRequest(pageSize, page);
        try {
            const response = studio
                ? await StoryService.Me(request)
                : await StoryService.List(request);

            if (response?.items) {
                setStoryList(response.items);
                setTotalStories(response.total || 0);
            }
        } catch (error) {
            message.error(t('errorLoadingStories') || 'Error loading stories');
        } finally {
            setLoading(false);
        }
    };

    const handlePaginationChange = (page: number) => {
        setCurrentPage(page);
    };


    return (
        <div style={{ padding: '20px' }}>
            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    {storyList.map((story) => (
                        <Col key={story.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                cover={<img alt={story.title} src={`http://localhost:8000${story.img}`} />}
                            >
                                <Meta title={story.title} description={story.description || t('noDescription')} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Spin>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalStories}
                    onChange={handlePaginationChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default StoryList;
