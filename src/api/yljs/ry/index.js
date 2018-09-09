import request from '@/plugin/axios'
import BaseURL from '../index'

var myUrl = BaseURL + '/ry'

export default {
  getbyname (name) {
    return request({
      url: myUrl + '/getbyname/' + name
    })
  }
}
