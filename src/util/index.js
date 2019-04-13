export const removeDuplicatedItem = arr => {
  for (let i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) !== i) {
      arr.splice(i, 1);
      i--;
    }
   }
  return arr;
};

export const catchStr = (str, length) => {
  if (str.length <= length) {
    return str;
  }
  const chineseRegex = /[^\x00-\xff]/g;
  const unicodeLength = str.replace(chineseRegex, '**').length;
  let newLength = 0;
  let result = '';
  for (let i = 0; i < unicodeLength; i++) {
    const targetStr = str.charAt(i).toString();
    if (targetStr.match(chineseRegex) !== null) {
      newLength += 2;
    } else {
      newLength++;
    }
    if (newLength > length) {
      break;
    }
    result += targetStr;
  }
  return result += '...';
};

export const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) === 'micromessenger';
};