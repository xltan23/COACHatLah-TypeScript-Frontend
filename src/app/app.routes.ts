import { Routes } from '@angular/router';
import { AddProfile } from './add-profile/add-profile';
import { ClassProfiles } from './class-profiles/class-profiles';
import { CcaProfiles } from './cca-profiles/cca-profiles';
import { MessagePlatform } from './message-platform/message-platform';

import { authGuard } from './guards/auth.guard';
import { reviewerGuard } from './guards/reviewer.guard';
import { Login } from './login/login';
import { Escalation } from './escalation/escalation';
import { Review } from './review/review';
import { Support } from './support/support';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component:Login},
    {path:'addProfile', component:AddProfile},
    {path:'class', component:ClassProfiles, canActivate:[authGuard]},
    {path:'cca', component:CcaProfiles, canActivate:[authGuard]},
    {path:'chat/:peerId', component:MessagePlatform, canActivate:[authGuard]},
    {path:'escalation', component:Escalation, canActivate:[authGuard, reviewerGuard]},
    {path:'review/:id', component:Review, canActivate:[authGuard, reviewerGuard]},
    {path:'support', component:Support, canActivate:[authGuard]}
];
