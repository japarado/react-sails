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

	}

	componentDidMount()
	{
		this.initializeSockets();
		this.watchSockets();
		this.indexCall();
	}

	// Socket.io initializer
	initializeSockets()
	{
		this.io = sailsIOClient(socketIOClient);
		this.io.sails.url = "http://localhost:1337";
	}

	watchSockets()
	{
		this.io.socket.on("post", msg => 
		{
			switch(msg.verb)
			{
			case "created":
					this.setState({ posts: [...this.state.posts, msg.data] });
				break;
			}
		});

	}

	indexCall()
	{
		this.io.socket.get("/post", {}, (resData, jwr) => 
		{
			if(resData.error)
			{
				console.error("Could not retrieve posts: " + resData.error);
				return;
			}
			else
			{
				const sortedPosts = resData.sort((a, b) => {
					return b.createdAt  - a.createdAt;
				})
				this.setState({ posts: sortedPosts })
			}
		});
	}

	createCall()
	{
		const newPostData = {
			title: this.state.title,
			body: this.state.body,
		};

		this.io.socket.post("/post", newPostData, (resData, jwr) =>
		{
			if(jwr.error)
			{
				console.log("Error thrown while saving the Post: " + jwr);
			}
			else
			{
				const increasedPosts = [...this.state.posts, resData];
				this.setState({ posts: [...this.state.posts, resData] })
			}
		});
	}

	destroyCall(id)
	{

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
		this.createCall();
	}

	handleDelete = (id) => e =>
	{
		this.destroyCall(id);
	}

	// Helper functions
	_sortPosts(posts)
	{
		const sorted = posts.sort((a, b) => {
			return b.createdAt - a.createdAt;
		});

		return sorted;
	}
	
	render()
	{
		return(
			<Fragment>
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
				<EnterForm 
					handleTitleChange={ this.handleTitleChange }
					handleBodyChange={ this.handleBodyChange }
					handleSubmit={ this.handleSubmit }
				/>
			</Fragment>
		);
	}
}

export default Posts;
