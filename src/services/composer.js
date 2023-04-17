import axios from 'axios';
import Config from '../config';

axios.defaults.baseURL = Config.composerService.baseUrl;

export const getAllComposers = () => {
  return axios.get('/composers').then(({ data }) => data);
}

export const generateMelodyByComposer = (composerName, noteSequence) => {
  const body = { noteSequence }

  return axios({
    method: 'post',
    url: `/composers/${composerName}/generate`,
    data: body,
    responseType: 'blob'
  }).then(({ data }) => new Blob([data]));
}
