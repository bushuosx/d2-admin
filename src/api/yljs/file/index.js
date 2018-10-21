import parent from '../index'
import crypto from '@/libs/util.crypto.js'
const BaseURL = parent.BaseURL + '/file'

const _buildError = function (msg) {
  return new Error('FileApi：' + msg)
}

function _reject (msg) {
  return Promise.reject(_buildError(msg))
}

export default {
  BaseURL,
  post ({ filename, filelength, filesha1 }) {
    if (!filename || filename === undefined || filename === '') {
      return _reject('filename不能为空')
    }
    if (filelength === null || filelength === undefined || filelength < 1) {
      return _reject('filelength不能小于1')
    }
    if (filesha1 === null || filesha1 === undefined || filesha1 === '') {
      return _reject('filesha1不能为空')
    }
    return parent.axios.post(BaseURL, { FileName: filename, FileLength: filelength, FileSha1: filesha1, UserToken: parent.getUserId() })
  },
  put ({ writetoken, position, data, size }) {
    // debugger
    if (writetoken === null || writetoken === undefined || writetoken === '') {
      return _reject('writetoken不能为空')
    }
    if (data === null || data === undefined) {
      return _reject('data不能为空')
    }
    if (position === null || position === undefined || position < 0) {
      return _reject('position不能小于0')
    }
    if (size === null || position === undefined || size < 0) {
      return _reject('size不能小于0')
    }
    let form = new FormData()
    form.append('WriteToken', writetoken)
    form.append('Position', position)
    form.append('File', data)
    form.append('Length', size)
    form.append('UserToken', parent.getUserId())
    return parent.axios.put(BaseURL, form)
  },
  complite (writetoken) {
    if (writetoken === null || writetoken === undefined || writetoken === '') {
      return _reject('writetoken不能为空')
    }
    return parent.axios.post(BaseURL + '/complite', { writetoken, userToken: parent.getUserId() })
  },
  get (fileid) {
    if (fileid === null || fileid === undefined || fileid === '') {
      return _reject('fileid不能为空')
    }
    return parent.axios.get(BaseURL + '/ ' + fileid)
  },
  uploadFile (file) {
    if (!file) {
      return _reject('file 不能为空')
    }
    return this.uploadBlob(file, file.name)
  },
  uploadBlob (blob, name) {
    // debugger
    if (!blob) {
      return _reject('blob is invalid')
    }
    let blobLength = blob.size
    if (!blobLength) {
      return _reject('blob is invalid')
    }
    if (!name) {
      if (!blob.name) {
        return _reject('name is invalid')
      } else {
        name = blob.name
      }
    }

    let self = this

    return crypto.sha1Blob(blob).then((res) => {
      // debugger
      return self.post({ filename: name, filelength: blobLength, filesha1: res }).then(function (postrst) {
        return new Promise((resolve, reject) => {
          if (!postrst || postrst === undefined) {
            reject(_buildError('未知错误，' + name))
          } else {
            if (postrst.code !== 1) {
              reject(_buildError(postrst.msg))
            } else {
              if (postrst.data.code === 1) {
                // 秒传了。。。
                resolve({ fileid: postrst.data.data })
              } else if (postrst.data.code === 2) {
                resolve({ writetoken: postrst.data.data, position: postrst.data.position })
              }
            }
          }
        })
      }).then(function ({ fileid, writetoken, position }) {
        if (fileid) {
          return Promise.resolve({ fileid })
        }

        // 上传准备就绪，开始传递数据
        const putSize = 1024 * 1024
        let start = position
        // 需要递归使用，所以声明
        let putfile = (pos) => {
          // debugger
          let end = Math.min(blobLength, pos + putSize)
          return new Promise((resolve, reject) => {
            self.put({
              writetoken,
              position: pos,
              data: crypto.blobSlice(blob, pos, end),
              // data: file,
              size: end - pos
            }).then(function (putrst) {
              if (!putrst) {
                return reject(_buildError('PutApi,未知错误'))
              } else {
                if (putrst.code !== 1) {
                  return reject(_buildError('PutApi，' + putrst.msg))
                } else {
                  if (putrst.data.code !== 3) {
                    return reject(_buildError('PutApi，' + putrst.data.msg))
                  } else {
                    // debugger
                    if (putrst.data.position !== end || putrst.data.data !== writetoken) {
                      // 服务器写入位置与预期不一致，抛弃
                      return reject(_buildError('PutApi返回的结果与预期不一致,' + name))
                    } else {
                      if (putrst.data.position === blobLength) {
                        return resolve({ writetoken, pos: putrst.data.position })
                      } else {
                        // 继续上传
                        return putfile(putrst.data.position)
                          .then(res => { return resolve(res) })
                          .catch(err => { return reject(err) })
                      }
                    }
                  }
                }
              }
            })
          })
        }

        return putfile(start)
      }).then(function ({ fileid, writetoken, pos }) {
        // if (fileid !== undefined && fileid) {
        //   return Promise.resolve({ fileid })
        // }
        return new Promise((resolve, reject) => {
          // debugger
          if (fileid) {
            return resolve({ fileid })
          }
          if (!writetoken) {
            return reject(_buildError('要求完成上传，但writetoken未知'))
          }
          if (pos !== blobLength) {
            return reject(_buildError('要求完成上传，但结束点' + pos + '与预期' + blobLength + '不一致。' + name))
          } else {
            self.complite(writetoken).then(function (crst) {
              if (!crst || crst === undefined) {
                return reject(_buildError('CompliteApi,未知错误'))
              } else {
                if (crst.code === 1) {
                  // 文件上传成功
                  return resolve({ fileid: crst.data.id })
                } else {
                  return reject(_buildError('文件上传失败：调用CompliteApi时服务器返回错误，' + crst.msg))
                }
              }
            }).catch(err => { return reject(err) })
          }
        })
      }).then(function ({ fileid }) {
        return new Promise((resolve, reject) => {
          if (fileid) {
            return resolve(fileid)
          } else {
            return reject(_buildError('未预知的错误'))
          }
        })
      })
    }
    )
  }
}
