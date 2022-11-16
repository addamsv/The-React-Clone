import jData from './app-sets/jData.json';
import sets from './app-sets/sets.json';
import custom from './app-sets/custom.json';

const getJData = () => jData;

const getSets = () => sets;

const getCustom = (): Array<ISection> | undefined => custom;

export default getJData;
export { getSets, getCustom };
