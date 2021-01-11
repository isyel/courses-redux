import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadAuthors, saveAuthor } from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import AuthorForm from "./AuthorForm";
import { newAuthor } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import { Prompt } from "react-router-dom";

export function ManageAuthorPage({
	authors,
	loadAuthors,
	saveAuthor,
	history,
	loading,
	...props
}) {
	const [author, setAuthor] = useState({ ...props.author });
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);
	const [pendingChanges, setPendingChanges] = useState(false);

	useEffect(() => {
		if (authors.length === 0)
			loadAuthors().catch((error) => {
				alert("Loading authors failed" + error);
			});
		else {
			setAuthor({ ...props.author });
		}
	}, [props.author]);

	function handleChange(event) {
		setPendingChanges(true);
		const { name, value } = event.target;
		setAuthor((prevAuthor) => ({
			...prevAuthor,
			[name]: value,
		}));
	}

	function formIsValid() {
		const errors = {};

		if (!author.name) errors.title = "Name is required";

		setErrors(errors);
		return Object.keys(errors).length === 0;
	}

	function handleSave(event) {
		event.preventDefault();
		setPendingChanges(false);
		if (!formIsValid()) return;
		setSaving(true);
		saveAuthor(author)
			.then(() => {
				toast.success("Author Saved");
				history.push("/authors");
			})
			.catch((error) => {
				setSaving(false);
				setErrors({ onSave: error.message });
			});
	}

	return authors.length === 0 && loading === 0 ? (
		<Spinner />
	) : (
		<>
			<Prompt
				when={pendingChanges}
				message="You have unsaved changes, are you sure you want to leave?"
			/>
			<AuthorForm
				author={author}
				errors={errors}
				onSave={handleSave}
				onChange={handleChange}
				saving={saving}
			/>
		</>
	);
}

ManageAuthorPage.propTypes = {
	author: PropTypes.object.isRequired,
	authors: PropTypes.array.isRequired,
	loadAuthors: PropTypes.func.isRequired,
	saveAuthor: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
};

export function getAuthorBySlug(authors, slug) {
	return authors.find((author) => author.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
	const slug = ownProps.match.params.slug;
	const author =
		slug && state.authors.length > 0
			? getAuthorBySlug(state.authors, slug)
			: newAuthor;
	return {
		author,
		authors: state.authors,
		loading: state.apiCallsInProgress > 0,
	};
}

// const mapDispatchToProps = {
// 	loadCourses: courseActions.loadCourses,
// 	loadAuthors: authorActions.loadAuthors,
// };

const mapDispatchToProps = {
	loadAuthors,
	saveAuthor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthorPage);
