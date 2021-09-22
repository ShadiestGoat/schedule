import { FunctionalComponent, h } from 'preact';
import { Link, Route, Router } from 'preact-router';
import IndexPage from '../routes/home';
import NotFoundPage from '../routes/notfound';
import SchedualCreator from '../routes/setup';


const App: FunctionalComponent = () => {
    return (
        <div id="preact_root">
            <Router>
                <Route path="/" component={IndexPage} />
                <Route path="/creator" component={SchedualCreator} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
