/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

const CourseList = ({ courses, onDeleteClick }) => {
	const [data, setData] = useState({});

	useEffect(() => {
		const coursesMapped = courses.map((course) => {
			return {
				watch: (
					<a
						className="btn btn-light"
						href={"http://pluralsight.com/courses/" + course.slug}>
						Watch
					</a>
				),
				title: <Link to={"/course/" + course.slug}>{course.title}</Link>,
				authorName: course.authorName,
				category: course.category,
				action: (
					<button
						className="btn btn-outline-danger"
						onClick={() => onDeleteClick(course)}>
						Delete
					</button>
				),
			};
		});
		setData({
			columns: [
				{
					label: "",
					field: "watch",
					width: 150,
				},
				{
					label: "Title",
					field: "title",
					sort: "asc",
					width: 270,
				},
				{
					label: "Author",
					field: "authorName",
					sort: "asc",
					width: 200,
				},
				{
					label: "Category",
					field: "category",
					sort: "asc",
					width: 100,
				},
				{
					label: "",
					field: "action",
					width: 150,
				},
			],
			rows: coursesMapped,
		});
	}, [courses]);

	return (
		courses.length > 0 && (
			<>
				<MDBDataTable striped bordered hover data={data} />
			</>
		)
	);
};

CourseList.propTypes = {
	courses: PropTypes.array.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
};

export default CourseList;

{
	/* <table className="table">
				<thead>
					<tr>
						<th />
						<th>Title</th>
						<th>Author</th>
						<th>Category</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{courses.map((course) => {
						return (
							<tr key={course.id}>
								<td>
									<a
										className="btn btn-light"
										href={"http://pluralsight.com/courses/" + course.slug}>
										Watch
									</a>
								</td>
								<td>
									<Link to={"/course/" + course.slug}>{course.title}</Link>
								</td>
								<td>{course.authorName}</td>
								<td>{course.category}</td>
								<td>
									<button
										className="btn btn-outline-danger"
										onClick={() => onDeleteClick(course)}>
										Delete
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table> */
}
