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

		this.io = {};
		this.initializeSockets();
	}

	// Socket.io initializer
	initializeSockets()
	{
		this.io = sailsIOClient(socketIOClient);
		this.io.sails.url = "http://localhost:1337";
	}

	// Lifecycle Methods
	componentDidMount()
	{
		this.indexCall();
	}

	componentWillUnmount()
	{
		this.io.socket.disconnect();
	}

	// API Calls
	indexCall()
	{

		this.io.socket.get("/post", (body, JWR) => 
		{
			this.setState({ posts: body });
		});
	}

	storeCall(data)
	{
		const newPostData = { 
			title: this.state.title,
			body: this.state.body,
		};

		this.io.socket.post("/post", newPostData, (body, JWR) =>
		{
			console.log(body);
		});
	}

	destroyCall(id)
	{
		this.io.socket.delete(`/post/${id}`, {}, (body, JWR) => 
		{
			console.log(JWR);
		});
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
