import React from 'react';
import getNewUID from '../../core/id';

const MenuFile = ({ menu }: { menu: Array<[string, string]> }) => {
  return (
    <>
     {menu.map(([menuProp, title]: [string, string]) => {
        const onPropClick = () => {
          console.log('menuProp as id', menuProp);
          // 'dataInputEv' { detail: { id } },
        }

        return (
          <div key={`key_${getNewUID()}`} className='dark-stl dstl-blck' onClick={onPropClick}>
            {title}
          </div>
        );
      })}
    </>
  );
}

export default MenuFile;
