import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-ioredis'

@Module({
  imports: [CategoryModule, ProductModule, PrismaModule, UploadModule,
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '..', 'uploads'),
      serveRoot:'/uploads'
    }),
    UserModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      store: redisStore,
      host: '127.17.0.2',
      port: 6379
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
