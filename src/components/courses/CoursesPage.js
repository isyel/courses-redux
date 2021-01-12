import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import UndoRedo from "../common/UndoRedo";

class CoursesPage extends React.Component {
	state = {
		redirectToAddCoursePage: false,
	};

	componentDidMount() {
		const { courses, authors, actions } = this.props;
		if (courses.length === 0)
			actions.loadCourses().catch((error) => {
				alert("Loading courses failed" + error);
			});

		if (authors.length === 0)
			actions.loadAuthors().catch((error) => {
				alert("Loading authors failed" + error);
			});
	}

	handleDeleteCourse = async (course) => {
		toast.success("Course Deleted!");
		try {
			await this.props.actions.deleteCourse(course);
		} catch (error) {
			toast.error("Delete Failed! " + error.message, { autoClose: false });
		}
	};

	render() {
		return (
			<>
				{this.state.redirectToAddCoursePage && <Redirect to="/course" />}
				<h2>Courses</h2>
				{this.props.loading ? (
					<Spinner />
				) : (
					<>
						<div className="row">
							<div className="col-sm">
								<button
									style={{ marginBottom: 20 }}
									className="btn btn-primary add-course"
									onClick={() =>
										this.setState({ redirectToAddCoursePage: true })
									}>
									Add Course
								</button>
							</div>
							<div className="col-sm text-right">
								<UndoRedo />
							</div>
						</div>
						<CourseList
							onDeleteClick={this.handleDeleteCourse}
							courses={this.props.courses}
						/>
					</>
				)}
			</>
		);
	}
}

CoursesPage.propTypes = {
	authors: PropTypes.array.isRequired,
	courses: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
	return {
		courses:
			state.authors.present.length === 0
				? []
				: state.courses.present.map((course) => {
						return {
							...course,
							authorName: state.authors.present.find(
								(a) => a.id === course.authorId
							).name,
						};
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }),
		authors: state.authors.present,
		loading: state.apiCallsInProgress > 0,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
			loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
			deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
