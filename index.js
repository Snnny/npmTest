let version = '3.0.0';

/*
* -1 不需要更新
* 0 自动更新
* 1 手动更新
*/ 
function compare(current, latest) {
  if(current === latest) return -1
  let a = current.split('.').map(item=> item.replace('v',''));
  let b = latest.split('.').map(item=> item.replace('v',''));
  let len = a.length - b.length;
  let type = 1;
  if (len > 0) {
      type = 2;
  } else if (len < 0) {
      
      type = 1;
  }
  len = Math.abs(len);
  for (let i = 0; i < len; i++) {
      type == 1 ? a.push('0') : b.push('0');
  }
  for (let k = 0; k < a.length; k++) {
    let d = a[k].charCodeAt(0), 
      c = b[k].charCodeAt(0)
      if (d == c) {
          continue
      }
      return k=== a.length - 1 ?  0 : 1;
  }
  return -1
}