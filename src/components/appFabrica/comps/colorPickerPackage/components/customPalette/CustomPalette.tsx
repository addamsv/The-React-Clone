import './index.scss';
import React from 'react';
import { hexToRgbJSN, validateAndGetHexValue } from '../../colorUtils';
import ID from '../../../../../../core/id';

const CustomPalette = (props: { onCustomPaletteItemClick: (hex: string, opacity: string) => void, uID: string, palette: any }) => {
  const { onCustomPaletteItemClick, uID, palette = [] } = props;
  const itemPaletteList = palette.map((itemProps: any) => {
    return (
      <CustomPaletteItem key={`key_${ID.new()}`} {...{onCustomPaletteItemClick, ...itemProps, ...{uID}}} />
    );
  });

  return (
    <div className="custom-palette">
      {...itemPaletteList}
    </div>
  );
}

const CustomPaletteItem = (props: {onCustomPaletteItemClick: (hex: string, opacity: string) => void, uID: string, hexColor: string, opacity: string, name?: string}) => {
  const { onCustomPaletteItemClick, uID, hexColor, opacity, name } = props;
  const nameTitle = name ? `Name: '${name}'\n` : '';

  const [ hex ] = validateAndGetHexValue(hexColor);
  const { red, grn, blu } = hexToRgbJSN(hex);
  return (
    <div className='custom-palette-item-transp-back '>
      <div  className="custom-palette-item"
            title={`${nameTitle}Hex Color: #${hex}\nOpacity: ${opacity}\nRGBA: NaN`}
            onClick={ () => onCustomPaletteItemClick(hex, opacity) /* , uID */}
            style={{ background: `rgba(${red}, ${grn}, ${blu}, ${opacity})` }}
      >
        <div className='custom-palette-solid-item' style={{ background: `#${hex}` }}></div>
      </div>
    </div>
  );
}

export default CustomPalette;
