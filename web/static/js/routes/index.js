import React from 'react';
import { IndexRoute, Route } from 'react-router';
import MenuView from 'views/menu';
import GameView from 'views/game';
import LobbyView from 'views/lobby';

export default (
  <Route>
    <Route path="/" component={MenuView} />
    <Route path="/lobby" component={LobbyView} />
    <Route path="/game" component={GameView} />
  </Route>
);

// export default {
//   path: '/',
//   component: LobbyView,
//   childRoutes: [
//     { path: '/game', component: GameView }
//   ]
// };
