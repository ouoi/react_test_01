import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../routes/Home';
import Posts from '../routes/Posts';
import Join from '../routes/Join';
import Login from '../routes/Login';
import Header from './Header';
import NotMatch from './NotMatch';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="container">
					<Header />
					<Switch>
						<Route path="/" component={Home} exact />
						<Route path="/posts" component={Posts} />
						<Route path="/accounts/join" component={Join} />
						<Route path="/accounts/login" component={Login} />
						<Route component={NotMatch} />
					</Switch>
				</div>
			</Router>
		);
	}
}
export default App;