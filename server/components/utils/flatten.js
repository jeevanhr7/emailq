function flatten(data) {
  const result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      const l = cur.length;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < l; i++) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach((p) => {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      });
      if (isEmpty && prop) { result[prop] = {}; }
    }
  }

  recurse(data, '');
  return result;
}

module.exports = flatten;
