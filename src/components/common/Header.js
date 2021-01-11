import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadCourses } from "../../redux/actions/courseActions";

const Header = ({ loadCourses, courses }) => {
	const activeStyle = { color: "#F15B2A" };

	useEffect(() => {
		if (courses.length === 0)
			loadCourses().catch((error) => {
				alert("Loading courses failed" + error);
			});
	}, []);

	return (
		<>
			<nav>
				<NavLink to="/" activeStyle={activeStyle} exact>
					Home
				</NavLink>
				{" | "}
				<NavLink to="/courses" activeStyle={activeStyle}>
					Courses
				</NavLink>
				{" | "}
				<NavLink to="/about" activeStyle={activeStyle}>
					About
				</NavLink>
				{" | "}
				<NavLink to="/authors" activeStyle={activeStyle}>
					Manage Authors
				</NavLink>
			</nav>
			<h5>No of Courses: {courses.length}</h5>
		</>
	);
};

Header.propTypes = {
	courses: PropTypes.array.isRequired,
	loadCourses: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
	return {
		courses: state.courses,
	};
}

const mapDispatchToProps = {
	loadCourses,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
