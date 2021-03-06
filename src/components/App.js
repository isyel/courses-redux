import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import CoursesPage from "./courses/CoursesPage";
// eslint-disable-next-line import/no-named-as-default
import ManageCoursePage from "./courses/ManageCoursePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthorsPage from "./authors/AuthorsPage";
// eslint-disable-next-line import/no-named-as-default
import ManageAuthorPage from "./authors/ManageAuthorPage";

function App() {
	return (
		<div className="container-fluid">
			<Header />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/about" component={AboutPage} />
				<Route path="/courses" component={CoursesPage} />
				<Route path="/authors" component={AuthorsPage} />
				<Route path="/course/:slug" component={ManageCoursePage} />
				<Route path="/author/:slug" component={ManageAuthorPage} />
				<Route path="/course" component={ManageCoursePage} />
				<Route path="/author" component={ManageAuthorPage} />
				<Route path="/404" component={PageNotFound} />
				<Route component={PageNotFound} />
			</Switch>
			<ToastContainer autoClose={3000} hideProgressBar />
		</div>
	);
}

export default App;
