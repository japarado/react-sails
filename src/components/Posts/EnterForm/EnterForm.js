import React, { Fragment } from "react";

const enterForm = (props) =>
{
	return(
		<Fragment>
			<div className="form-group">
				<label htmlFor="title">Title</label>
				<input type="text" className="form-control" name="title" id="title" onChange={ props.handleTitleChange() }/>
			</div>
			<div className="form-group">
				<label htmlFor="body">Body</label>
				<textarea className="form-control" name="body" onChange={ props.handleBodyChange() }></textarea>
			</div>
			<button className="btn btn-primary" onClick={ props.handleSubmit() }>Save</button>
		</Fragment>
	);
};

export default enterForm;
