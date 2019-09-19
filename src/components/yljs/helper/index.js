import yljs from '@/libs/util.yljs.js'

/**
 * 过滤出方法
 */
function getFunction () {
  // debugger
  let tmp = { ...yljs }
  for (let k in tmp) {
    if (!(typeof tmp[k] === 'function' || tmp[k] instanceof Function)) {
      delete tmp[k]
    }
  }
  return tmp
}

const helper = getFunction()
export default helper
