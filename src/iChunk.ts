import jData from './app-sets/jData.json';
import sets from './app-sets/sets.json';
import custom from './app-sets/custom.json';

const getJData = () => {
  // console.log('getJData');
  return jData;
}

const getSets = () => {
  // console.log('getSets');
  return sets;
}

const getCustom = (): Array<ISection> | undefined => {
  // console.log('getCustom');
  return custom;
}

export { getSets, getCustom };
export default getJData;
