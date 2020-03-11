/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useQuery } from "react-fetching-library";
import { useParams } from "react-router";

import {
  FigureCgovImage,
  FigureCgovVideo,
  SearchBox,
  Spinner,
  Pronunciation,
  RelatedResourceList
} from "../../components";
import { testIds } from "../../constants";
import { getTermDefinition } from "../../services/api/actions";
import { useStateValue } from "../../store/store.js";

const Definition = () => {
  const { idOrName } = useParams();
  const { loading, payload, error } = useQuery(getTermDefinition(idOrName));
  const [{ altLanguageDictionaryBasePath, language, languageToggleSelector }] = useStateValue();

  useEffect(() => {
    // check if there is an alternate language analog
    if (
      altLanguageDictionaryBasePath !== "" &&
      payload &&
      payload.otherLanguages &&
      payload.otherLanguages.length > 0
    ) {
      initLanguageToggle(payload.otherLanguages[0]);
    }
  }, [payload]);

  const initLanguageToggle = langObj => {
    const langToggle = document.querySelector(languageToggleSelector);
    if (langToggle && langObj.prettyUrlName) {
      langToggle.href = `${altLanguageDictionaryBasePath}/def/${langObj.prettyUrlName}`;
    }
  };

  const renderPronunciation = () => {
    return (
      <>
        {payload.pronunciation && (
          <Pronunciation
            lang={language}
            pronunciationObj={payload.pronunciation}
          />
        )}
      </>
    );
  };

  const renderRelatedResources = () => {
    return (
      <div className="related-resources" data-testid={testIds.MORE_INFORMATION}>
        {renderRelatedResourceLinks()}
        {renderMediaItems()}
      </div>
    );
  };

  const renderRelatedResourceLinks = () => {
    let headerText = language === "en" ? "More Information" : "Más información";
    if (payload.relatedResources && payload.relatedResources.length > 0) {
      return (
        <>
          <h6>{headerText}</h6>
          <RelatedResourceList
            linksArr={payload.relatedResources}
            lang={language}
          />
        </>
      );
    } else {
      return <></>;
    }
  };

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
            } else {
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
          {renderPronunciation()}
          {payload.definition && (
            <div
              data-testid={testIds.TERM_DEF_DESCRIPTION}
              dangerouslySetInnerHTML={{ __html: payload.definition.html }}
            ></div>
          )}
          {((payload.relatedResources && payload.relatedResources.length > 0) ||
            (payload.media && payload.media.length > 0)) &&
            renderRelatedResources()}

          <SearchBox showTitle />
        </>
      )}
    </>
  );
};

export default Definition;
