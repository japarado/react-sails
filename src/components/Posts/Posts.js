import React, { Component, Fragment } from "react";
import axios from "axios";
import qs from "qs";

import Post from "./Post/Post";
import EnterForm from "./EnterForm/EnterForm";

/*let socketIOClient = require("socket.io-client");
let sailsIOClient = require("sails.io.js");*/

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

		this.io = null;

		this.initializeSockets();
		this.watchSocket();
	}

	// Socket.io initializer
	initializeSockets()
	{
		this.io = sailsIOClient(socketIOClient);
		this.io.sails.url = "http://localhost:1337";
	}

	watchSocket()
	{

		this.io.socket.on("post", action =>
		{
			switch(action.msg)
			{
				case "CREATE":
				case "DESTROY":
				case "UPDATE":
					this.indexCall();
			}
		});
	}

	// Lifecycle Methods
	componentDidMount()
	{
		this.indexCall();
	}

	// API Calls
	indexCall()
	{
		const that = this;
		this.io.socket.get("/post", (data, jwr) =>
		{
			this.setState({ posts: data });
		});
	}

	createCall()
	{
		const newPostData = { 
			title: this.state.title,
			body: this.state.body,
		};
		
		this.io.socket.post("/post", newPostData, (data, jwr) => 
		{
			console.log(data);
		});

		/*axios({
			method: "post",
			url: "http://localhost:1337/post",
			data: newPostData,
			headers: {
				"content-type": "application/x-ww-form-urlencoded",
			},
		});*/
	}

	destroyCall(id)
	{
		this.io.socket.delete(`/post/${id}`, {}, (data, jwr) =>
		{
			let reducedPosts = this.state.posts.filter(post => post.id != id);
			this.setState({ posts: reducedPosts });
		});
		/*axios({
			method: "delete",
			url: `http://localhost:1337/post/${id}`
		});*/
	}

	csrfTokenCall()
	{
		/*axios({
			method: "get",
			url: "http://localhost:1337/csrfToken",
		}).then(res => res.data._csrf).then(csrfToken => this.setState({ csrfToken: csrfToken }));*/
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
		this.createCall();
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
