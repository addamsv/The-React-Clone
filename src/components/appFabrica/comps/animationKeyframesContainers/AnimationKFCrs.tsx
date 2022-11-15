import './index.scss';

import React from 'react';
import Model from '../../../../models/model';
import ID from '../../../../core/id';
import JFab from '../../JFab';

/** !!!!SUPER SUSPITIOUSE!!!! */
const getSortedCrByTimelinePos = (jsnCr: any, crNamePrefix = 'akf', sortBy = 'akfTimelinePos') => {
  const a: any = [];
  let ai = 0;
  let hold = [];
  let lastCrNameInDest;

  /* sort by grd-priority and add crName */

  Object.keys(jsnCr).some((c) => {
    lastCrNameInDest = Model.ob().container.getLastCrNameInDest(c);

    if (Model.ob().container.getCrNameWithoutNum(lastCrNameInDest) === crNamePrefix) {
      a[ai] = jsnCr[c];
      a[ai].crName = c;
      ai += 1;
    }
    return false;
  });

  for (let pass = 1; pass < ai; pass += 1) {
    for (let i = 0; i < ai - 1; i += 1) {
      if (Number(a[i].cs[sortBy]) > Number(a[i + 1].cs[sortBy])) {
        hold = a[i];
        a[i] = a[i + 1];
        a[i + 1] = hold;
      }
    }
  }
  return a;
}

const AnimationKeyframesContainers = ({ crName }: { crName: string, type: string }) => {
  let jsnCr = Model.ob().container.getCrsJSN(crName);
  jsnCr = getSortedCrByTimelinePos(jsnCr, 'akf', 'akfTimelinePos');

  const onAddBtn = () => {
    // data-input: "add_akfRWDkPrc_btn", ${crName}
  }

  return (
    <>
      {Object
      .keys(jsnCr)
      .map((keyframesCntr) => {
        const onRemEvent = () => {
          // data-input: "rem_akfRWDkPrc_btn", ${crName} , slide: ${crName}_${jsnCr[keyframesCntr].crName}
        }

        return (
          <div key={`key_${ID.new()}`} className="menu-cr">
            <span className='rem-animation-kf' onClick={onRemEvent}>x</span>
            <JFab route='collectionAnimation' crName={`${crName}_${jsnCr[keyframesCntr].crName}`} />
          </div>
        );
      })}
      <a className="btn-algn-right dark-stl dstl-blck" onClick={onAddBtn}>+</a>
    </>
  );
}

export default AnimationKeyframesContainers;