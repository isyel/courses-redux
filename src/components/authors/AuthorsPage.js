import React from "react";
import { connect } from "react-redux";
import * as authorActions from "../../redux/actions/authorActions";
import * as courseActions from "../../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import AuthorsList from "./AuthorsList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class AuthorsPage extends React.Component {
	state = {
		redirectToAddAuthorPage: false,
	};

	componentDidMount() {
		const { authors, actions, courses } = this.props;
		if (authors.length === 0)
			actions.loadAuthors().catch((error) => {
				alert("Loading authors failed" + error);
			});
		if (courses.length === 0)
			actions.loadCourses().catch((error) => {
				alert("Loading courses failed" + error);
			});
	}

	handleDeleteAuthor = async (author) => {
		const authorCourses = this.props.courses.filter(
			(course) => course.authorId == author.id
		).length;

		if (authorCourses > 0) {
			toast.success("Author Has An Associated Course, Cannot be Deleted!");
			return;
		}
		toast.success("Author Deleted!");

		try {
			await this.props.actions.deleteAuthor(author);
		} catch (error) {
			toast.error("Delete Failed! " + error.message, { autoClose: false });
		}
	};

	render() {
		return (
			<>
				{this.state.redirectToAddAuthorPage && <Redirect to="/author" />}
				<h2>Authors</h2>
				{this.props.loading ? (
					<Spinner />
				) : (
					<>
						<button
							style={{ marginBottom: 20 }}
							className="btn btn-primary add-course"
							onClick={() => this.setState({ redirectToAddAuthorPage: true })}>
							Add Author
						</button>
						<AuthorsList
							onDeleteClick={this.handleDeleteAuthor}
							authors={this.props.authors}
						/>
					</>
				)}
			</>
		);
	}
}

AuthorsPage.propTypes = {
	authors: PropTypes.array.isRequired,
	courses: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
	return {
		courses:
			state.authors.length === 0
				? []
				: state.courses.map((course) => {
						return {
							...course,
							authorName: state.authors.find((a) => a.id === course.authorId)
								.name,
						};
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }),
		authors: state.authors,
		loading: state.apiCallsInProgress > 0,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
			loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
			deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
