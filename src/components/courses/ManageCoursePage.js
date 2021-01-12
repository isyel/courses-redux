import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import { Prompt } from "react-router-dom";

export function ManageCoursePage({
	courses,
	authors,
	loadAuthors,
	loadCourses,
	saveCourse,
	history,
	loading,
	...props
}) {
	const [course, setCourse] = useState({ ...props.course });
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);
	const [pendingChanges, setPendingChanges] = useState(false);

	useEffect(() => {
		if (courses.length === 0)
			loadCourses().catch((error) => {
				alert("Loading courses failed" + error);
			});
		else {
			setCourse({ ...props.course });
		}

		if (authors.length === 0)
			loadAuthors().catch((error) => {
				alert("Loading authors failed" + error);
			});
	}, [props.course]);

	function handleChange(event) {
		setPendingChanges(true);
		const { name, value } = event.target;
		setCourse((prevCourse) => ({
			...prevCourse,
			[name]: name === "authorId" ? parseInt(value, 10) : value,
		}));
	}

	function formIsValid() {
		const { title, authorId, category } = course;
		const errors = {};

		if (!title) errors.title = "Title is required";
		if (!authorId) errors.author = "Author is required";
		if (!category) errors.category = "Category is required";

		setErrors(errors);
		return Object.keys(errors).length === 0;
	}

	function handleSave(event) {
		event.preventDefault();
		setPendingChanges(false);
		if (!formIsValid()) return;
		setSaving(true);
		saveCourse(course)
			.then(() => {
				toast.success("Course Saved");
				history.push("/courses");
			})
			.catch((error) => {
				setSaving(false);
				setErrors({ onSave: error.message });
			});
	}

	return (authors.length === 0 || courses.length) && loading === 0 ? (
		<Spinner />
	) : (
		<>
			<Prompt
				when={pendingChanges}
				message="You have unsaved changes, are you sure you want to leave?"
			/>
			<CourseForm
				course={course}
				errors={errors}
				authors={authors}
				onChange={handleChange}
				onSave={handleSave}
				saving={saving}
			/>
		</>
	);
}

ManageCoursePage.propTypes = {
	course: PropTypes.object,
	authors: PropTypes.array.isRequired,
	courses: PropTypes.array.isRequired,
	loadAuthors: PropTypes.func.isRequired,
	loadCourses: PropTypes.func.isRequired,
	saveCourse: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
};

export function getCourseBySlug(courses, slug) {
	return courses.find((course) => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
	const slug = ownProps.match.params.slug;
	const course =
		slug && state.courses.present.length > 0
			? getCourseBySlug(state.courses.present, slug)
			: newCourse;
	if (course == null) {
		ownProps.history.push("/404");
	}
	return {
		course,
		courses: state.courses.present,
		authors: state.authors.present,
		loading: state.apiCallsInProgress > 0,
	};
}

// const mapDispatchToProps = {
// 	loadCourses: courseActions.loadCourses,
// 	loadAuthors: authorActions.loadAuthors,
// };

const mapDispatchToProps = {
	loadCourses,
	loadAuthors,
	saveCourse,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
