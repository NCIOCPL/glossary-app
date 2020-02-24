import React from "react";
import { useQuery } from "react-fetching-library";
import { useParams } from "react-router";
import { useStateValue } from "../../store/store.js";

import { Spinner, FigureCgovImage, FigureCgovVideo } from "../../components";
import { testIds } from "../../constants";
import { getTermDefinition } from "../../services/api/actions";

const Definition = () => {
  const { idOrName } = useParams();
  const { loading, payload, error } = useQuery(getTermDefinition(idOrName));
  const [{ language }] = useStateValue();

  const renderRelatedResources = () => {
    let headerText = (language === 'en')? 'More Information' : 'Más información';
    return (
      <>
        {((payload.relatedResources && payload.relatedResources.length > 0) ||
          (payload.media && payload.media.length > 0)) && (
          <h6>{headerText}</h6>
        )}
        {renderRelatedResourceLinks()}
        {renderMediaItems()}
      </>
    );
  };

  const renderRelatedResourceLinks = () => <></>;

  const renderMediaItems = () => {
    return (
      <>
        {payload.media.length > 0 &&
          payload.media.map(mediaItem => {
            if (mediaItem.Type === "Image") {
              const imgArr = mediaItem.ImageSources;
              const thumbUri = imgArr.find(imgItem => imgItem.Size === "571")
                .Src;
              const enlargeUri = imgArr.find(
                imgItem => imgItem.Size === "original"
              ).Src;
              return (
                <FigureCgovImage
                  altText={mediaItem.Alt}
                  caption={mediaItem.Caption}
                  classes="image-left-medium"
                  key={mediaItem.Ref}
                  lang={language}
                  thumb_uri={thumbUri}
                  enlarge_uri={enlargeUri}
                />
              );
            } else if (mediaItem.Type === "Video") {
              return (
                <FigureCgovVideo
                  classes="video center size75"
                  key={mediaItem.UniqueId}
                  videoId={mediaItem.UniqueId}
                  videoTitle={mediaItem.Title}
                >
                  {mediaItem.Caption}
                </FigureCgovVideo>
              );
            }else{
              return false;
            }
          })}
      </>
    );
  };

  return (
    <>
      {loading && <Spinner />}
      {!loading && !error && payload && (
        <>
          <h1
            className="term-title"
            data-testid={testIds.TERM_DEF_TITLE}
            data-cdr-id={payload.termId}
          >
            {payload.termName}
          </h1>
          {payload.pronunciation && (
            <div
              className="pronunciation"
              data-testid={testIds.TERM_DEF_PRONUNCIATION}
            >
              {payload.pronunciation.key}
            </div>
          )}
          {payload.definition && (
            <div
              data-testid={testIds.TERM_DEF_DESCRIPTION}
              dangerouslySetInnerHTML={{ __html: payload.definition.html }}
            ></div>
          )}
          {renderRelatedResources()}
        </>
      )}
    </>
  );
};

export default Definition;
