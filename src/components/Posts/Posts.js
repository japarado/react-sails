import React, { Component, Fragment } from "react";
import axios from "axios";
import qs from "qs";

import Post from "./Post/Post";
import EnterForm from "./EnterForm/EnterForm";

// Sails socket.io
import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";

class Posts extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			posts: [],
			title: "",
			body: "",
			csrfToken: "",
		};
	}

	// Lifecycle Methods
	componentDidMount()
	{
		this.indexCall();
		this.csrfTokenCall();
	}

	// API Calls
	indexCall()
	{
		axios({
			method: "get",
			url: "http://localhost:1337/post",
		}).then(res => res.data).then(posts => this.setState({ posts: posts }));
	}

	storeCall(data)
	{
		this.csrfTokenCall();
		data = qs.stringify(data);
		axios({
			method: "post",
			url: "http://localhost:1337/post",
			data: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"X-CSRF-Token": this.state.csrfToken,
			}
		}).then(res => console.log(res)).catch(err => console.log(`Name: ${err.name} \n Messsage: ${err.message}`));
	}

	destroyCall(id)
	{
		axios({
			method: "delete",
			url: `http://localhost:1337/post/${id}`,
		}).then(res => console.log(res)).then(this.indexCall());
	}

	csrfTokenCall()
	{
		axios({
			method: "get",
			url: "http://localhost:1337/csrfToken",
		}).then(res => res.data._csrf).then(csrfToken => this.setState({ csrfToken: csrfToken }));
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
