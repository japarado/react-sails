import React, { Component } from "react";
import logo from "./logo.svg";

import Posts from "../components/Posts/Posts";


class App extends Component 
{
	constructor(props)
	{
		super(props);

		this.io = null;
		this.initializeSockets();
	}

	initializeSockets()
	{
	}

	render() 
	{
		return (
			<div className="container-fluid">
				<Posts />
			</div>
		);
	}
}

export default App;
