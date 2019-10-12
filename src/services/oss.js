import OSS from 'ali-oss';
import uuid from 'uuid/v1';
import _ from 'lodash';
const bucket = 'img-emake-cn';
const region = 'oss-cn-shanghai';
const accessKeyId = 'LTAIjK54yB5rocuv';
const accessKeySecret = 'T0odXNBRpw2tvTffxcNDdfcHlT9lzD';

const client = new OSS({
  bucket,
  region,
  accessKeyId,
  accessKeySecret
});

export const oss = {
  put: file => {
    const type = file.type.split('/')[1] || '';
    return client.put(`${uuid()}.${type}`, file);
  },
  filePut: file => {
    const str = _.takeRight(file.name.split('.'));
    return client.put(`${uuid()}.${str}`, file);
  }
};
