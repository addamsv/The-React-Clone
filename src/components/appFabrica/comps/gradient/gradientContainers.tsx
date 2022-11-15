import './index.scss';

import React, { useState } from 'react';
import GradientComponent from './comps/gradientComponent';
import ID from '../../../../core/id';
import Model from '../../../../models/model';

type priorityT = {cs: {priority: string}};

const GradientContainers = ({ crName, type }: { crName: string, type: string }) => {
  const [upd, setUpdateGradientContainer] = useState({updateTimes: 1});
  const updateGradientContainer = () => {
    setUpdateGradientContainer({updateTimes: upd.updateTimes + 1});
  }

  const getPriority = ({cs: {priority}}: priorityT) => Number(priority);

  const onAdd = () => {
    Model.ob().container.mkCrGrt(crName);
    updateGradientContainer();
  }

  const liArray = Object
    .entries(Model.ob().container.getCrsJSN(crName, Model.ob().data.getJsn()))
    .filter(([curCrName]) => curCrName.substring(0, 3) === 'grd')
    .sort(([, el1], [, el2]) => getPriority(el1 as priorityT) - getPriority(el2 as priorityT))
    .map(([grdCrName]) => <GradientComponent key={`key_${ID.new()}`} onAdd={onAdd} updateGradientContainer={updateGradientContainer} crName={crName} grdCrName={grdCrName} type={type} />);

  /* // data-sortable-on={`{"priority":"${priorityPrf}_grd_priority","cstmzblock":"${priorityPrf}cstmzblock","blockposition":"${priorityPrf}blockposition"}`} */
  return (
    <>
      <a className='dark-stl' onClick={onAdd}>+</a>
      <ul className='priority-cr'>
        {liArray}
      </ul>
    </>
  );
}

export default GradientContainers;