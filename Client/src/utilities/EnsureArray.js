import IsArray from './IsArray';

export default obj => IsArray(obj) ? obj : [obj];
