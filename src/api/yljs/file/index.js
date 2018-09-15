import axiosService from '@/plugin/axios'
import parent from '../index'

const BaseURL = parent.BaseURL + '/file'

export default {
  BaseURL,
  post ({ filename, filelength, filesha1 }) {
    return axiosService.post(BaseURL, { FileName: filename, FileLength: filelength, FileSha1: filesha1 })
  },
  put ({ writetoken, position, data, size }) {
    let form = new FormData()
    form.append('WriteToken', writetoken)
    form.append('Position', position)
    form.append('File', data, 'sss')
    form.append('Length', size)
    form.append('UserToken', 'Test')
    return axiosService.put(BaseURL, form)
  },
  complite (writetoken) {
    return axiosService.post(BaseURL + '/complite', { writetoken, UserToken: 'Test' })
  },
  get (fileid) {
    return axiosService.get(BaseURL + '/ ' + fileid)
  }
}
