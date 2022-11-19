import jData from './core/app-sets/jData.json';
import sets from './core/app-sets/sets.json';
import custom from './core/app-sets/custom.json';

const getJData = () => jData;
const getSets = () => sets;
const getCustom = () => custom;

export default getJData;
export { getSets, getCustom };
