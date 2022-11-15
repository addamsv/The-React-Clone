import React from 'react';
import ID from '../../core/id';

const MenuFile = ({ menu }: { menu: Array<[string, string]> }) => {
  return (
    <>
     {menu.map(([menuProp, title]: [string, string]) => {
        const onPropClick = () => {
          console.log('menuProp as id', menuProp);
          // 'dataInputEv' { detail: { id } },
        }

        return (
          <div key={`key_${ID.new()}`} className='dark-stl dstl-blck' onClick={onPropClick}>
            {title}
          </div>
        );
      })}
    </>
  );
}

export default MenuFile;
