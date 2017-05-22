import React, { Component } from 'react';
import axios from 'axios';
import Gallery from '../components/Gallery';

class Home extends Component {

	constructor() {
		super();
		this.state = {
			posts: []
		};
	}

	componentDidMount() {
		axios.get('/v1/posts/list', {
		}).then((res) => {
			this.setState({
				posts: res.data.posts
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		return (
			<div>
				<Gallery posts={this.state.posts} />
			</div>
		);
	}
}
export default Home;