import { appConfig } from 'src/config/app.config';

export const environment = {
  BASEURL: 'http://35.222.7.136',
  CLOUDINARY_BASE_URL: `https://res.cloudinary.com/${appConfig.CLOUDINARY_CLOUD_NAME}/image/upload`,
  production: true
};
