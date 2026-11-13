import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AmenitiesModule } from './amenities/amenities.module.js';
import { BlogCategoriesModule } from './blog_categories/blog_categories.module.js';
import { BlogPostTagsModule } from './blog_post_tags/blog_post_tags.module.js';
import { BlogPostsModule } from './blog_posts/blog_posts.module.js';
import { BlogTagsModule } from './blog_tags/blog_tags.module.js';
import { ContactEventsModule } from './contact_events/contact_events.module.js';
import { PermissionsModule } from './permissions/permissions.module.js';
import { ProvinceAliasesModule } from './province_aliases/province_aliases.module.js';
import { ProvincesModule } from './provinces/provinces.module.js';
import { RolePermissionsModule } from './role_permissions/role_permissions.module.js';
import { RolesModule } from './roles/roles.module.js';
import { RoomAmenitiesModule } from './room_amenities/room_amenities.module.js';
import { RoomCategoriesModule } from './room_categories/room_categories.module.js';
import { RoomLikesModule } from './room_likes/room_likes.module.js';
import { RoomMediaModule } from './room_media/room_media.module.js';
import { RoomModerationsModule } from './room_moderations/room_moderations.module.js';
import { RoomReportsModule } from './room_reports/room_reports.module.js';
import { RoomShareDetailsModule } from './room_share_details/room_share_details.module.js';
import { RoomStatsModule } from './room_stats/room_stats.module.js';
import { RoommateRequestsModule } from './roommate_requests/roommate_requests.module.js';
import { RoomsModule } from './rooms/rooms.module.js';
import { UserRolesModule } from './user_roles/user_roles.module.js';
import { UsersModule } from './users/users.module.js';
import { ViewingAppointmentsModule } from './viewing_appointments/viewing_appointments.module.js';
import { WardAliasesModule } from './ward_aliases/ward_aliases.module.js';
import { WardsModule } from './wards/wards.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'thue-tro-backend',
    }),
    AmenitiesModule,
    BlogCategoriesModule,
    BlogPostTagsModule,
    BlogPostsModule,
    BlogTagsModule,
    ContactEventsModule,
    PermissionsModule,
    ProvinceAliasesModule,
    ProvincesModule,
    RolePermissionsModule,
    RolesModule,
    RoomAmenitiesModule,
    RoomCategoriesModule,
    RoomLikesModule,
    RoomMediaModule,
    RoomModerationsModule,
    RoomReportsModule,
    RoomShareDetailsModule,
    RoomStatsModule,
    RoommateRequestsModule,
    RoomsModule,
    UserRolesModule,
    UsersModule,
    ViewingAppointmentsModule,
    WardAliasesModule,
    WardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
