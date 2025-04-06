import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/email/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[MailModule,
    JwtModule.register({
      global:true,
      secret:'sekret',
      signOptions:{
        expiresIn:'1h'
      }
    })
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
