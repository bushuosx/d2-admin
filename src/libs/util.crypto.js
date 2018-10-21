import CryptoJS from 'crypto-js'

const _buildError = function (msg) {
  return new Error(msg)
}

const blobSlice = function (blob, startByte, endByte) {
  // debugger
  if (blob.slice) {
    return blob.slice(startByte, endByte)
  }
  // 兼容firefox
  if (blob.mozSlice) {
    return blob.mozSlice(startByte, endByte)
  }
  // 兼容webkit
  if (blob.webkitSlice) {
    return blob.webkitSlice(startByte, endByte)
  }
  return null
}

const blobToWordArray = function (blob) {
  if (!blob) {
    return null
  }
  return CryptoJS.lib.WordArray.create(blob)
}

const sha1ArrayBuffer = function (buffer, blockSize = 1024 * 1024 * 20) {
  // debugger
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(_buildError('blob is null'))
    }

    let blobLength = buffer.byteLength ? buffer.byteLength : buffer.size
    if (!blobLength) {
      return reject(_buildError('blob cannot be read'))
    }

    try {
      let start = 0
      let hash = CryptoJS.algo.SHA1.create()
      while (start < blobLength) {
        let end = Math.min(blobLength, start + blockSize)
        hash.update(
          blobToWordArray(blobSlice(buffer, start, end))
          // blobSlice(blob, start, end)
        )
        start = end
      }
      let rst = hash.finalize().toString()
      return resolve(rst)
    } catch (err) {
      return reject(_buildError(err))
    }
  })
}

const readBlobToArrayBuffer = function (blob) {
  return new Promise((resolve, reject) => {
    if (!blob) {
      return reject(_buildError('blob is invalid'))
    }
    let fr = new FileReader()
    fr.onload = (ev) => {
      return resolve(ev.target.result)
    }
    fr.onerror = (err) => {
      return reject(err)
    }
    fr.readAsArrayBuffer(blob)
  })
}

const sha1Blob = function (blob) {
  return readBlobToArrayBuffer(blob).then(res => {
    return sha1ArrayBuffer(res)
  })
}

// const sha1File = function (file) {
//   // // 成功的代码
//   // return new Promise((resolve, reject) => {
//   //   if (!file) {
//   //     return reject(_buildError('file is null'))
//   //   }
//   //   try {
//   //     let fr = new FileReader()
//   //     fr.onload = (ev) => {
//   //       let buffer = ev.target.result
//   //       return resolve(sha1ArrayBuffer(buffer))
//   //     }
//   //     fr.onerror = () => {
//   //       return reject(_buildError('读取文件出错'))
//   //     }
//   //     fr.readAsArrayBuffer(file)
//   //   } catch (err) {
//   //     return reject(err)
//   //   }
//   // })

// }

export default {
  blobSlice,
  blobToWordArray,
  sha1Blob,
  sha1File: sha1Blob,
  sha1ArrayBuffer,
  readBlobToArrayBuffer
}
