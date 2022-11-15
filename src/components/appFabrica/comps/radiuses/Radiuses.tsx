import './index.scss';
import React, { useState } from 'react';
import JFab from '../../JFab';

const Radiuses = ({ crName = '' }: { crName: string }) => {
  const [menuNum, setJFabMenu] = useState('');

  const jFabSubmenu = menuNum ? <JFab crName={crName} route={`collectionRadiuses_m${menuNum}_content`} /> : null;

  const onJFabMenuClick = (num: string) => setJFabMenu((num === menuNum) ? '' : num);

  return (
    <>
      <div className="r-wrapper">
        <Radius className='r-top-lft' menuNum='2' currNum={menuNum} fn={onJFabMenuClick} />
        <Radius className='r-top-rgt' menuNum='3' currNum={menuNum} fn={onJFabMenuClick} />
        <Radius className='border-all' menuNum='1' currNum={menuNum} fn={onJFabMenuClick} />
        <Radius className='r-bottom-rgt' menuNum='4' currNum={menuNum} fn={onJFabMenuClick} />
        <Radius className='r-bottom-lft' menuNum='5' currNum={menuNum} fn={onJFabMenuClick} />
      </div>
      {jFabSubmenu}
    </>
  );
}

const Radius = ({ className, menuNum, currNum, fn }: { className: string, currNum: string, menuNum: string, fn: (menuNum: string) => void }) => {
  return <div className={`${className}${currNum === menuNum ? ' active' : ''}`} onClick={() => fn(menuNum)}></div>;
}

export default Radiuses;
