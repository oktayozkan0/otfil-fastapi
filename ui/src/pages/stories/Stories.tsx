import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/Hooks";
import { toUnLoading } from "../../store/SiteSlice";
import { useTranslation } from "react-i18next";
import { PageHeaderSection } from "../../components/common/PageHeadSection";
import { mdlGetStoriesRequest } from "../../models/service-models/stories/GetStoriesRequest";
import { StoryService } from "../../services/stories";
import { Story } from "../../models/domain/story";
import StoryList from "../../components/stories/StoryList";

const Stories = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [storyList, setStoryList] = useState<Story[]>([]);

  useEffect(() => {
    getStories();
  }, []);

  const getStories = async () => {
    var request = new mdlGetStoriesRequest(10, 0);
    var response = await StoryService.List(request);
    if (response != null)
      setStoryList(response.items)
    dispatch(toUnLoading());
  }

  return (
    <div className="nk-content ">
      <div className="container-fluid">
        <div className="nk-content-inner">
          <div className="nk-content-body">
            <PageHeaderSection
              pageDescription={t("stories.description")}
              pageTitle={t("stories.title")}
            />
          </div>
          <StoryList studio={false} />
        </div>
      </div>
    </div>
  );
};

export default Stories;
