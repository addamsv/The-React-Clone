import './index.scss';
import React, { useState } from 'react';
import JFab from '../../JFab';

const BoxBordersCr = ({ crName }: { crName: string}) => {
  const [menuNum, setJFabMenu] = useState('');

  const jFabSubmenu = menuNum ? <JFab crName={crName} route={`collectionBoxBorders_m${menuNum}_content`} /> : null;

  const onJFabMenuClick = (num: string) => setJFabMenu((num === menuNum) ? '' : num);

  return (
    <>
      <div className="r-wrapper">
        <Border className='border-lft' menuNum='4' currNum={menuNum} fn={onJFabMenuClick} />
        <Border className='border-top' menuNum='1' currNum={menuNum} fn={onJFabMenuClick} />
        <Border className='border-all' menuNum='0' currNum={menuNum} fn={onJFabMenuClick} />
        <Border className='border-rht' menuNum='2' currNum={menuNum} fn={onJFabMenuClick} />
        <Border className='border-btm' menuNum='3' currNum={menuNum} fn={onJFabMenuClick} />
      </div>
      {jFabSubmenu}
    </>
  );
}

const Border = ({ className, menuNum, currNum, fn }: { className: string, currNum: string, menuNum: string, fn: (menuNum: string) => void }) => {
  return <div className={`${className}${currNum === menuNum ? ' active' : ''}`} onClick={() => fn(menuNum)}></div>;
}

export default BoxBordersCr;
