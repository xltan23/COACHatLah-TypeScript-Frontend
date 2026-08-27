import { Routes } from '@angular/router';
import { AddProfile } from './add-profile/add-profile';
import { ClassProfiles } from './class-profiles/class-profiles';
import { CcaProfiles } from './cca-profiles/cca-profiles';
import { MessagePlatform } from './message-platform/message-platform';

export const routes: Routes = [
    {path:'addProfile', component:AddProfile},
    {path:'class/:id', component:ClassProfiles},
    {path:'cca/:id', component:CcaProfiles},
    {path:'chat/:uid1/:uid2', component:MessagePlatform}
];
