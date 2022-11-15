import './index.scss';
import React, { useState } from 'react';
import JFab from '../../JFab';

const Margins = ({ crName }: { crName: string}) => {
  const [menuNum, setJFabMenu] = useState('');

  const jFabSubmenu = menuNum ? <JFab crName={crName} route={`collectionMargins_m${menuNum}_content`} /> : null;

  const onJFabMenuClick = (num: string) => setJFabMenu((num === menuNum) ? '' : num);

  return (
    <>
      <div className="r-wrapper">
        <Margin className='margin-lft' menuNum='4' currNum={menuNum} fn={onJFabMenuClick} />
        <Margin className='margin-top' menuNum='1' currNum={menuNum} fn={onJFabMenuClick} />
        <Margin className='margin-all' menuNum='0' currNum={menuNum} fn={onJFabMenuClick} />
        <Margin className='margin-rht' menuNum='2' currNum={menuNum} fn={onJFabMenuClick} />
        <Margin className='margin-btm' menuNum='3' currNum={menuNum} fn={onJFabMenuClick} />
      </div>
      {jFabSubmenu}
    </>
  );
}

const Margin = ({ className, menuNum, currNum, fn }: { className: string, currNum: string, menuNum: string, fn: (menuNum: string) => void }) => {
  return <div className={`${className}${currNum === menuNum ? ' active' : ''}`} onClick={() => fn(menuNum)}></div>;
}

export default Margins;
