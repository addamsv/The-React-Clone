import React, { useState } from "react";
import DataManager from "../../../core/dataManager";
import Model from "../../../models/model";
import getArrSortedByPriority from "../../../utils/getArrSortedByPriority";
import MainMenu from "./mainMenu/MainMenu";
import Picker from "./picker/Picker";

const Scene = () => {
  const [scene, setScene] = useState({hid: Model.ob().getHID(), update: 0}); // 

  const updateSection = (hid?: string) => {
    if (hid) {
      setScene({...scene, ...{hid}});
      return;
    }
    setScene({...scene, ...{update: scene.update + 1}});
  }

  DataManager.setOnSlidePickFn(updateSection);
  DataManager.setOnSectionChangeFn(updateSection);

  const getCrName = (currentHid: string) => {
    return DataManager.getSlideFirstCr(currentHid) || Model.ob().container.getFirstCrName();
  }

  const sectionsForInsert = Model.ob().getSectionsHidArr();

  const sectionArr = sectionsForInsert
  ? sectionsForInsert
    .map((currentHid: string, indx) => {
      Model.ob().setJsnByHid(currentHid);
      return <Section key={indx} hid={scene.hid} currentHid={currentHid}
          crName={getCrName(currentHid)} jsn={Model.ob().data.getJsn()} />;
    })
  : [];

  Model.ob().setJsnByHid(scene.hid);

  return (
    <>
      <MainMenu />
      {sectionArr}
    </>
  );
}

const Section = ({ hid, currentHid, crName, jsn }: { hid: string, currentHid: string, crName: string, jsn: any }) => {
  const scaleMode  =  'scale-100-percent'; // Model.ob().set.customizeMode ? 'scale-25-percent' :
  // <div key={`h${hid}_${crName}_main-cstmz-block`} id={`h${hid}_${crName}_main-cstmz-block`} className='main-cstmz-block'></div>

  /**
   * Insert Common Section
   */
  if (hid !== currentHid) {
    return (
      <div id={`h${currentHid}_${crName}_section`} className={`section-wrapper ${scaleMode}`}
        onClick={() => DataManager.getOnSectionChangeFn()(currentHid)}>
        <SectionContainers hid={currentHid} jsn={jsn[crName]} crName={crName} />
      </div>
    );
  }

  /**
   *    Insert PickerSection
   *
   * showMainFramePicker(crName);
   * showAnimationMenu(crName);
   */

  const picker = <div id="framePicker" className="framePicker"><Picker {...{hid: currentHid, incomeCrJsn: jsn[crName], crName}} /></div>;

  const animationMenu = null;

  return (
    <div id={`h${currentHid}_${crName}_section`} className={`section-wrapper ${scaleMode}`}>
      <SectionContainers hid={currentHid} jsn={jsn[crName]} crName={crName} />
      {picker}
      {animationMenu}
    </div>
  );
}

const isCrNameNotValid = (invalidCrName: string): boolean => {
  return ['hdr', 'cs', 'rwd', 'akf', 'grt', 'grd', 'bsc', 'tsc', 'hvr'].some((el) => el === invalidCrName);
}

/**
 * Former getHtml()
 */
const SectionContainers = ({ hid, jsn, crName }: { hid: string, jsn: any, crName: string }) => {
  return (
    <>
      {getArrSortedByPriority(jsn)
      .map(([cr, crJsn]: [string, any]) => {
        if (!isCrNameNotValid(Model.ob().container.getCrNameWithoutNum(cr))) {
          const type = crJsn.cs.type;
          const cssForStdAndForm = ((type === 'stdWrp' || type === 'form') ? 'std-section__wrapper ' : '');
          switch (type) {
            case 'cntnr':
              return (
                <div key={`h${hid}-${crName}-${cr}-${type}`} id={`h${hid}-${crName}-${cr}-${type}`} className={`change-point ${type}h${hid} h${hid}-${crName}-${cr}-${type} animate`}>
                  <SectionContainers hid={hid} jsn={crJsn} crName={`${crName}-${cr}`} />
                </div>
              );
            case 'stdWrp':
            case 'form':
              // className: `${cssForStdAndForm}change-point ${type}h${hid} h${hid}-${crName}-${cr}-${type} ${isAnimatedStyle}animate`
              // Model.ob().data.getData({ [cr]: crJsn }, cr, 'content', type))
              return (
                <form id={`h${hid}-${crName}-${cr}-${type}`} className={`${cssForStdAndForm}change-point ${type}h${hid} h${hid}-${crName}-${cr}-${type} animate`}>
                  <SectionContainers hid={hid} jsn={crJsn} crName={`${crName}-${cr}`} />
                </form>
              );
            case 'video':
              return (
                <video controls loop autoPlay key={`h${hid}-${crName}-${cr}-${type}`} id={`h${hid}-${crName}-${cr}-${type}`} className={`change-point ${type}h${hid} h${hid}-${crName}-${cr}-${type} animate`}>
                    <source  type="video/mp4" src={ Model.ob().data.getData({ [cr]: crJsn }, cr, 'src', type) }>
                        Your browser does not support this video format.
                    </source>
                </video>
              );
            default:
              return (
                <div key={`h${hid}-${crName}-${cr}-${type}`} id={`h${hid}-${crName}-${cr}-${type}`} className={`change-point ${type}h${hid} h${hid}-${crName}-${cr}-${type} animate`}>
                  { Model.ob().data.getData({ [cr]: crJsn }, cr, 'content', type) }
                </div>
              );
          }
        }
      })}
    </>
  );
}

export default Scene;
