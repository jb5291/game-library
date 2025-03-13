import { Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';
import { GameFormComponent } from './components/game-form/game-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileGamesComponent } from './components/profile-games/profile-games.component';
import { authGuard } from './guards/auth.guard';
import { CollectionsListComponent } from './components/collections/collections-list/collections-list.component';
import { CollectionFormComponent } from './components/collections/collection-form/collection-form.component';
import { CollectionDetailComponent } from './components/collections/collection-detail/collection-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'games', component: GameListComponent, canActivate: [authGuard] },
  { path: 'games/new', component: GameFormComponent, canActivate: [authGuard] },
  { path: 'games/edit/:id', component: GameFormComponent, canActivate: [authGuard] },
  { path: 'games/:id', component: GameDetailComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile/games', component: ProfileGamesComponent, canActivate: [authGuard] },
  { path: 'collections', component: CollectionsListComponent, canActivate: [authGuard] },
  { path: 'collections/new', component: CollectionFormComponent, canActivate: [authGuard] },
  { path: 'collections/edit/:id', component: CollectionFormComponent, canActivate: [authGuard] },
  { path: 'collections/:id', component: CollectionDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/games' }
];