import _ from 'lodash';
  
export function rolling(before, after) {
    return function (_number, index, array) {
      const start = Math.max(0, index - before);
      const end   = Math.min(array.length, index + after + 1);
      return _.slice(array, start, end);
    }
}