# Chatter

Simple social network using full-stack typescript.  
Requires:
-Angular
-NestJS
-MongoDB
-Node.js

## Angular

### Setup
Inside of `chatter/chat-app`
Add app config `app.config.ts` to the `src/config` folder. Requires cloudinary account

`app.config.ts`
```
export const appConfig: any = {
  CLOUDINARY_CLOUD_NAME: 'cloudinary cloud name',
};
```

### Run
To start front-end open `chatter/chat-app` install packages `npm i` and run `ng serve`
runs locally on localhost:4200

```
cd chatter/chat-app
npm i
ng serve
```

## NestJS

### Setup
Inside of `chatter/chat-server`
Add cloudinary config `cloudinary.config.ts` to the `src/config` folder. Requires cloudinary account

`cloudinary.config.ts`
```
import * as Cloudinary from 'cloudinary';

const cloudinary = Cloudinary.v2;

export const cloudinaryConfig: any = cloudinary.config({
    cloud_name: 'cloudinary cloud name',
    api_key: 'cloudinary api key',
    api_secret: 'cloudinary api secret',
});
```

### Run
To start back-end open `chatter/chat-server` install packages `npm i` and run `npm run start:dev`
runs locally on localhost:3000
```
cd chatter/chat-server
npm i
npm run start:dev
```

## MongoDB
Make sure to have mongoDB running locally at port 27017