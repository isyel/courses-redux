import React from "react";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { connect } from "react-redux";

import PropTypes from "prop-types";

const UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
	<p>
		{canUndo && (
			<button type="button" onClick={onUndo} className="btn btn-info">
				Undo
			</button>
		)}
		{canRedo && (
			<button type="button" onClick={onRedo} className="btn btn-info">
				Redo
			</button>
		)}
	</p>
);

UndoRedo.propTypes = {
	canUndo: PropTypes.bool,
	canRedo: PropTypes.bool,
	onUndo: PropTypes.func,
	onRedo: PropTypes.func,
};

const mapStateToProps = (state) => {
	return {
		canUndo: state.courses.past.length > 0,
		canRedo: state.courses.future.length > 0,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onUndo: () => dispatch(UndoActionCreators.undo()),
		onRedo: () => dispatch(UndoActionCreators.redo()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UndoRedo);
