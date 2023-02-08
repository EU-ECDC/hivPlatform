import IsNull from "./IsNull";

export default (xmlDoc, rootElem, nodeName, nodeValue = null) => {
  let node = xmlDoc.createElement(nodeName);
  if (!IsNull(nodeValue)) {
    node.innerHTML = nodeValue;
  }
  rootElem.appendChild(node);
  return node;
};
