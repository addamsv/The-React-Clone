import './index.scss';
import React, { useState } from 'react';
import JFab from '../../JFab';

const Paddings = ({ crName }: { crName: string}) => {
  const [menuNum, setJFabMenu] = useState('');

  const jFabSubmenu = menuNum ? <JFab crName={crName} route={`collectionPaddings_m${menuNum}_content`} /> : null;

  const onJFabMenuClick = (num: string) => setJFabMenu((num === menuNum) ? '' : num);

  return (
    <>
      <div className="r-wrapper">
        <Padding className='padding-lft' menuNum='4' currNum={menuNum} fn={onJFabMenuClick} />
        <Padding className='padding-top' menuNum='1' currNum={menuNum} fn={onJFabMenuClick} />
        <Padding className='padding-all' menuNum='0' currNum={menuNum} fn={onJFabMenuClick} />
        <Padding className='padding-rht' menuNum='2' currNum={menuNum} fn={onJFabMenuClick} />
        <Padding className='padding-btm' menuNum='3' currNum={menuNum} fn={onJFabMenuClick} />
      </div>
      {jFabSubmenu}
    </>
  );
}

const Padding = ({ className, menuNum, currNum, fn }: { className: string, currNum: string, menuNum: string, fn: (menuNum: string) => void }) => {
  return <div className={`${className}${currNum === menuNum ? ' active' : ''}`} onClick={() => fn(menuNum)}></div>;
}

export default Paddings;
