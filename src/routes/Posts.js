import React, { Component } from 'react';
import axios from 'axios';
import getDate from '../libs/getDate';
import PostDetail from '../components/PostDetail';
import { Route, Link } from 'react-router-dom';

class Posts extends Component {
	
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
				<table className="table table-bordered table-hover">
					<thead>
						<tr>
							<th>제목</th>
							<th>작성일</th>
							<th>삭제</th>
						</tr>
					</thead>
					<tbody>
						{this.state.posts.map((post, key) => {
							var dateObj = getDate(post.created_at);
							return (
								<tr key={key}>
									<td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
									<td>{dateObj.year}.{dateObj.month}.{dateObj.day}</td>
									<td></td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<Route path="/posts/:id" component={PostDetail} />
			</div>
		);
	}
}
export default Posts;