import React from "react";

const post = (props) => 
{
	return(
		<div className="col-md-9 border my-2 p-3">
			<h1>{ props.title }</h1>
			<p className="subtitle">By: { props.id }</p>
			<p>{ props.body }</p>
			<button className="btn btn-danger" onClick={ props.handleDelete }>Delete</button>
		</div>
	);
};

export default post;
