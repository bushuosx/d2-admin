import parent from '../index'

const BaseURL = parent.BaseURL + '/file'

function reject (msg) {
  return Promise.reject(new Error('FileApi：' + msg))
}

export default {
  BaseURL,
  post ({ filename, filelength, filesha1 }) {
    if (!filename || filename === undefined || filename === '') {
      return reject('filename不能为空')
    }
    if (filelength === null || filelength === undefined || filelength < 1) {
      return reject('filelength不能小于1')
    }
    if (filesha1 === null || filesha1 === undefined || filesha1 === '') {
      return reject('filesha1不能为空')
    }
    return parent.axios.post(BaseURL, { FileName: filename, FileLength: filelength, FileSha1: filesha1, UserToken: parent.getUserId() })
  },
  put ({ writetoken, position, data, size }) {
    if (writetoken === null || writetoken === undefined || writetoken === '') {
      return reject('writetoken不能为空')
    }
    if (data === null || data === undefined) {
      return reject('data不能为空')
    }
    if (position === null || position === undefined || position < 0) {
      return reject('position不能小于0')
    }
    if (size === null || position === undefined || size < 0) {
      return reject('size不能小于0')
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
      return reject('writetoken不能为空')
    }
    return parent.axios.post(BaseURL + '/complite', { writetoken, userToken: parent.getUserId() })
  },
  get (fileid) {
    if (fileid === null || fileid === undefined || fileid === '') {
      return reject('fileid不能为空')
    }
    return parent.axios.get(BaseURL + '/ ' + fileid)
  }
}
