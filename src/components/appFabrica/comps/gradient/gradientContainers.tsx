import './index.scss';

import React, { useState } from 'react';
import GradientComponent from './comps/gradientComponent';
import getNewUID from '../../../../core/id';
import Data from '../../../../models/dataPackage/dataModel';
import Container from '../../../../models/dataPackage/containerModel';

type priorityT = {cs: {priority: string}};

const GradientContainers = ({ crName, type }: { crName: string, type: string }) => {
  const [upd, setUpdateGradientContainer] = useState({updateTimes: 1});
  const updateGradientContainer = () => {
    setUpdateGradientContainer({updateTimes: upd.updateTimes + 1});
  }

  const getPriority = ({cs: {priority}}: priorityT) => Number(priority);

  const onAdd = () => {
    Container.mkCrGrt(crName);
    updateGradientContainer();
  }

  const liArray = Object
    .entries(Container.getCrsJSN(crName, Data.getJsn()))
    .filter(([curCrName]) => curCrName.substring(0, 3) === 'grd')
    .sort(([, el1], [, el2]) => getPriority(el1 as priorityT) - getPriority(el2 as priorityT))
    .map(([grdCrName]) => <GradientComponent key={`key_${getNewUID()}`} onAdd={onAdd} updateGradientContainer={updateGradientContainer} crName={crName} grdCrName={grdCrName} type={type} />);

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
