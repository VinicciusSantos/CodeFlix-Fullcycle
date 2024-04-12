import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories-module';
import { DatabaseModule } from './nest-modules/database-module';
import { ConfigModule } from './nest-modules/config-module';
import { SharedModule } from './nest-modules/shared-module';
import { CastMembersModule } from './nest-modules/cast-members-module';
import { GenresModule } from './nest-modules/genres-module/genres.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SharedModule,
    CategoriesModule,
    CastMembersModule,
    GenresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
