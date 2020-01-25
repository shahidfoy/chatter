import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  // cors cerdentials
  // app.use((req, res, next)  => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  //   // res.header('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
  //   next();
  // });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
