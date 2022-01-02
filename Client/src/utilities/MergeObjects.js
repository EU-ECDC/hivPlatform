import IsArray from './IsArray';
import InArray from './InArray';
import IsObject from './IsObject';
import IsNull from './IsNull';

const MergeObjects = (...objects) => {

  if (InArray(true, objects.map(IsNull))) {
    return objects[0];
  }

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (IsArray(pVal) && IsArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (IsObject(pVal) && IsObject(oVal)) {
        prev[key] = MergeObjects(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
};

export default MergeObjects;
