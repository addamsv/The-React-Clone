let id = 0;
const getNewUID = () => id += 1;
const getUID = () => id;

export default getNewUID;
export { getUID };

// const add = () => id += 1;
// const ID = { new: add, get: () => id }
// export default ID;
// export default getNewUID;
