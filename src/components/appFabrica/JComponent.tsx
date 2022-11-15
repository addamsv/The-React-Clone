import React from 'react';
import Model from '../../models/model';
import JFab from './JFab';
import Select from './comps/select/Select';
import Textarea from './comps/textarea/Textarea';
import Input from './comps/input/Input';
import InputRange from './comps/inputRange/InputRange';
import MenuImage from './comps/menuImage/MenuImage';
import Radiuses from './comps/radiuses/Radiuses';
import BoxBordersCr from './comps/boxBordersCr/BoxBordersCr';
import Paddings from './comps/paddings/Paddings';
import Margins from './comps/margins/Margins';
import Shadow from './comps/collectionShadow/Shadow';
import CollectionColor from './comps/colorPickerPackage/CollectionColor';
import GradientContainers from './comps/gradient/gradientContainers';
import CollectionHover from './comps/collectionHover/CollectionHover';
import AnimationKeyframesContainers from './comps/animationKeyframesContainers/AnimationKFCrs';

type IJComponent = {
  container: string;
  crName?: string;
  subCr?: string;
  title?: string;
  data?: {
    type?: string,
    subType?: 'bsc' | 'tsc',
    m?: '%' | 'sec'| 'Sec' | 'Deg'| 'deg' | 'px'| 'times' | 'em'
  };
}

const JComponent = ({ container, crName = '', subCr = '', title = '', data }: IJComponent) => {
  if (!container) {
    return null;
  }

  const type =  data?.type || Model.ob().container.getCrType(crName);

  const props = { route: container, container, crName, subCr, type, title, data };

  switch (container) {
    case 'title':
      return <div className='title-h2'>{title}</div>;
    case 'select':
      return <Select {...props} />;
    case 'input':
      return (subCr === 'content' || subCr === 'description' || subCr === 'url')
        ? <Textarea {...props} />
        : <Input {...props} />;
    case 'input_range':
      return <InputRange {...props} />
    case 'image':
      return <MenuImage {...props} />
    case 'radiuses':
      return <Radiuses {...props} />
    case 'boxBordersCr':
      return <BoxBordersCr {...props} />
    case 'paddings':
      return <Paddings {...props} />
    case 'margins':
      return <Margins {...props} />
    case 'thumb':
      return <CollectionColor {...props} />
    case 'collectionShadowForCntr':
      return <Shadow {...props} />
    case 'collectionHover':
      return <CollectionHover {...props} />
    case 'gradientCntrs':
      return <GradientContainers {...props} />;
    case 'animationKeyframesCntrs': /* Temp */
      return <AnimationKeyframesContainers {...props} />;

    /** COLLECTIONS (should be in JFab)  */
    case 'collectionElementStyle':
      return <JFab {...props} />;
    case 'collectionAnimations':
      return <JFab {...props} />;
    case 'collectionTypo':
      return <JFab {...props} />;
    case 'collectionPosition':
      return <JFab {...props} />;
    case 'boxBorders':
      return <JFab {...{ ...props, ...{ route: 'collectionBoxBorders' } }} />;
    case 'transform':
      return <JFab {...{ ...props, ...{ route: 'collectionTransform' } }} />;
    case 'filters':
      return <JFab {...{ ...props, ...{ route: 'collectionFilters' } }} />;

    default: {
      return null;
    }
  }
}

export default JComponent;
