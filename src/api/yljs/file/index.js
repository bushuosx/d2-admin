import axiosService from '@/plugin/axios'
import parent from '../index'

const BaseURL = parent.BaseURL + '/file'

export default {
  BaseURL,
  post ({ filename, filelength, filesha1 }) {
    axiosService.post(BaseURL, { filename, filelength, filesha1 })
  },
  put ({ writetoken, position, file, length }) {
    axiosService.put(BaseURL, { writetoken, position, file, length })
  },
  complite (writetoken) {
    axiosService.get(BaseURL + '/' + writetoken)
  },
  get (fileid) {
    axiosService.get(BaseURL + '/' + fileid)
  }
}
