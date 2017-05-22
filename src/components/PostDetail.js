import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import getDate from '../libs/getDate';

class PostDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			post: {}
		};
		this.historyBack = this.historyBack.bind(this);
	}

	historyBack() {
		this.props.history.push('/posts');
	}

	componentDidMount() {
		axios.get(`/v1/posts/detail/${this.props.match.params.id}`, {
		}).then((res) => {
			this.setState({
				post: res.data.post
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		let dateObj = getDate(this.state.post.created_at);

		return (
			<Modal show={true} onHide={this.historyBack}>
				<Modal.Header>
					<Modal.Title>
						{this.state.post.title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<div>작성일: {dateObj.year}.{dateObj.month}.{dateObj.day}</div>
					<img src={`/uploads/${this.state.post.thumbnail}`} alt="" />
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.historyBack}>Close</Button>
					<Button bsStyle="primary">Save changes</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
export default PostDetail;