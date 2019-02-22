import React, { Component, Fragment } from "react";
import axios from "axios";
import qs from "qs";

import Post from "./Post/Post";
import EnterForm from "./EnterForm/EnterForm";

class Posts extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			posts: [],
			title: "",
			body: ""
		};
	}

	// Lifecycle Methods
	componentDidMount()
	{
		this.indexCall();
	}

	// API Calls
	indexCall()
	{
		axios({
			method: "get",
			url: "http://localhost:1337/api/v1/post"
		}).then(res => res.data.posts).then(posts => this.setState({ posts: posts }));
	}

	storeCall(data)
	{
		data = qs.stringify(data);
		axios({
			method: "post",
			url: "http://localhost:1337/api/v1/post",
			data: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			}
		}).then(res => console.log(res));
	}

	destroyCall(id)
	{
		axios({
			method: "delete",
			url: `http://localhost:1337/api/v1/post/${id}`,
		}).then(res => console.log(res)).then(this.indexCall());
	}

	// Event Handlers
	handleTitleChange = () => e =>
	{
		const title = e.target.value;
		this.setState({ title: title });
	}

	handleBodyChange = () => e =>
	{
		const body = e.target.value;
		this.setState({ body: body });
	}

	handleSubmit = () => e =>
	{
		const data = {
			title: this.state.title,
			body: this.state.body,
		};
		this.storeCall(data);
		this.indexCall();
	}

	handleDelete = (id) => e =>
	{
		this.destroyCall(id);
	}
	
	
	render()
	{
		return(
			<Fragment>
				<EnterForm 
					handleTitleChange={ this.handleTitleChange }
					handleBodyChange={ this.handleBodyChange }
					handleSubmit={ this.handleSubmit }
				/>
				<div className="row justify-content-center mt-4">
					{this.state.posts.map(post => 
					{
						return(
							<Post 
								{...post} 
								key={ post.id }
								handleDelete={ this.handleDelete(post.id) }
							/>
						);
					})}
				</div>
			</Fragment>
		);
	}
}

export default Posts;
