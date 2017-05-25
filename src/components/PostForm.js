import React, { Component } from 'react';
import axios from 'axios';

class PostForm extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			title : '' ,
			content : '' ,
			thumbnail : '',
			isLogin : false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFile = this.handleFile.bind(this);
		this.loginCheck = this.loginCheck.bind(this);
	}

	componentDidMount(){
		axios.get('/v1/accounts/status', {
		}).then((res) => {
			this.setState({
				isLogin: res.data.isLogin
			}, this.loginCheck);
		}).catch((error) => {
			console.log(error);
		});
	}

	loginCheck(){
		if (!this.state.isLogin) {
			this.props.history.push('/accounts/login');
		}
	}

	handleChange(event) {
		let result = {};
		result[event.target.name] = event.target.value;
		this.setState(result);
	}

	handleFile(event) {
		var files = event.target.files;
		if (files.length > 0) {
			var file = files[0];
			var reader = new FileReader();
			reader.onload = function() {
				document.getElementById('thumbnail').setAttribute('src', reader.result);
				reader.closeFile();
			}
			reader.readAsDataURL(file);
			this.setState({thumbnail: file});
		}
	}

	handleSubmit(event) {
		event.preventDefault();

		if (!this.state.title) {
			alert("이름을 입력하세요");
			this.refs.titleRef.focus();
			return;
		}

		if (!this.state.content) {
			alert("비밀번호를 입력하세요");
			this.refs.contentRef.focus();
			return;
		}

		const formData = new FormData();
		formData.append('thumbnail', this.state.thumbnail);
		formData.append('title', this.state.title);
		formData.append('content', this.state.content);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};

		axios.post('/v1/posts/write', formData, config).then((res) => {
			alert('작성되었습니다.');
			this.props.history.push('/posts');
		}).catch((error) => {
			console.log(error);
		});
	}
	
	render() {
		return (
			<form action="" method="post" onSubmit={this.handleSubmit}>
				<table className="table table-bordered">
					<tbody>
						<tr>
							<th>제목</th>
							<td><input type="text" name="title" ref="titleRef" value={this.state.title} onChange={this.handleChange} className="form-control" /></td>
						</tr>
						<tr>
							<th>내용</th>
							<td><input type="text" name="content" ref="contentRef" value={this.state.content} onChange={this.handleChange} className="form-control" /></td>
						</tr>
						<tr>
							<th>섬네일</th>
							<td>
								<input type="file" name="thumbnail" onChange={this.handleFile} />
								<br/>
								<img id="thumbnail" src="" className="image_width" />
							</td>
						</tr>
					</tbody>
				</table>
				<button className="btn btn-primary">저장</button>
			</form>
		);
	}
}
export default PostForm;