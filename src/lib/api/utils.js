import {API, Auth} from 'aws-amplify';
import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {concat} from 'apollo-link';
import AsyncStorage from '@react-native-community/async-storage';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';
import axios from 'axios';

const baseUrl = 'http://35.176.213.179:4000/graphql';
// const baseUrl = 'http://352b-182-185-14-234.ngrok.io/graphql';

//
export default async function makeApolloClient() {
  const uri = `${baseUrl}/graphql`;
  const authMiddleware = setContext(async (_, {headers}) => {
    const tokensString = await AsyncStorage.getItem('tokens');
    const token = tokensString ? JSON.parse(tokensString).jwtToken : '';

    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

  const client = new ApolloClient({
    link: concat(authMiddleware, new HttpLink({uri})),
    cache: new InMemoryCache(),
    name: 'cagi-consumer-rn',
    version: '1.1.2',
  });
  return client;
}

export async function apiRequest(method, url, data) {
  console.log(method, url, data);
  const tokensString = await AsyncStorage.getItem('tokens');
  const token = tokensString ? JSON.parse(tokensString).jwtToken : '';
  const requestObject = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (method === 'get') {
    requestObject.queryStringParameters = data;
  } else {
    requestObject.body = data;
  }

  const apiName = 'apic60289d2';
  const path = url;
  const myInit = {
    // OPTIONAL
    headers: {
      Authorization: `Bearer ${token}`,
    }, // OPTIONAL
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: data,
  };

  API[method](apiName, path, myInit)
    .then(response => {
      alert('lll');
      // Add your code here
    })
    .catch(error => {
      // alert(';;;;');
      console.log(JSON.stringify(error.response.message, null, 2));
    });
  //mainapis
  const res = await API[method]('apic60289d2', url, requestObject);
  console.log(res);
  return res;
}

export const getPhotoExtenstion = image => {
  switch (image.mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    default:
      return 'wtf';
  }
};

export async function apiV2Request(method, path, params, image = {}) {
  let url = `${baseUrl}${path}`;
  const tokensString = await AsyncStorage.getItem('tokens');
  const token = tokensString ? JSON.parse(tokensString).jwtToken : '';
  let headers = {Authorization: token};
  let data = params;

  if (Object.keys(image).length > 0) {
    const formData = new FormData();
    const name = `${image.fileName}.${getPhotoExtenstion(image)}`;
    formData.append('image', {
      uri: image.path,
      name,
      type: image.mime,
    });
    data = formData;
    headers = {...headers, 'Content-Type': 'multipart/form-data'};
    url = `${url}?filename=${name}`;
  }

  const requestObject = {
    headers,
    data,
    method,
    url,
  };

  return axios(requestObject);
}
