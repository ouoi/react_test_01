import React, { Component } from 'react';
import axios from 'axios';
import getDate from '../libs/getDate';
import PostDetail from '../components/PostDetail';
import { Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Posts extends Component {
	
	constructor() {
		super();
		this.state = {
			posts: []
		};
		this.removePost = this.removePost.bind(this);
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

	removePost(event) {
		event.preventDefault();
		if (confirm('삭제하시겠습니까?')) {
			document.location.href = event.target.href;
		}
	}

	render() {
		return (
			<div>
				<div className="text-right">
					<Link to="/write" className="btn btn-primary">작성하기</Link>
				</div>
				<br/>

				<table className="table table-bordered table-hover">
					<thead>
						<tr>
							<th>제목</th>
							<th className="text-center">작성일</th>
							<th className="text-center">삭제</th>
						</tr>
					</thead>
					<tbody>
						{this.state.posts.map((post, key) => {
							var dateObj = getDate(post.created_at);
							return (
								<tr key={key}>
									<td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
									<td className="text-center">{dateObj.year}.{dateObj.month}.{dateObj.day}</td>
									<td className="text-center"><Button bsStyle="danger" href={`/v1/posts/delete/${post.id}`} onClick={this.removePost}>삭제</Button></td>
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