import { Route, Switch } from 'react-router';
import './App.css';
import { ChangeUser } from './containers/ChangeUser';
import { Home } from './containers/Home';
import { NewUser } from './containers/NewUser';
import { RegCup } from './containers/RegCup';
import { RemoveCups } from './containers/RemoveCups';

const App = () => {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/newUser">
                    <NewUser />
                </Route>
                <Route path="/regCup">
                    <RegCup />
                </Route>
                <Route path="/changeUser">
                    <ChangeUser />
                </Route>
                <Route>
                    <RemoveCups path="/removeCups" />
                </Route>
            </Switch>
        </div>
    );
};

export default App;
