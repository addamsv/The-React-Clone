let id = 0;

const add = () => id += 1;

const ID = { new: add, get: () => id }

export default ID;
