import React from "react";
import { ManageCoursePage } from "./ManageCoursePage";
import { mount } from "enzyme";
import { courses, authors, newCourse } from "../../../tools/mockData";

function render(args) {
	const defaultProps = {
		authors,
		courses,
		history: {},
		course: newCourse,
		match: {},
		saveCourse: jest.fn(),
		loadAuthors: jest.fn(),
		loadCourses: jest.fn(),
	};

	const props = { ...defaultProps, ...args };
	return mount(<ManageCoursePage {...props} />);
}

it("sets error when attempting to save an empty title field", () => {
	const wrapper = render();
	wrapper.find("form").simulate("submit");
	const error = wrapper.find(".alert").first();
	expect(error.text()).toBe("Title is required");
});
