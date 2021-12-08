function hasKeys(object, list) {
  var flag = true;
  try {
    list.forEach(function (element) {
      if (!(element in object)) {
        flag = false;
      }
    });
  } catch (err) {
    flag = false;
  }
  return flag;
}

module.exports = {
  hasKeys: hasKeys,
};
