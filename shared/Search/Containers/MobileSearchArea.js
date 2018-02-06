import React, { Component } from "react"
import { connect } from "react-redux";
import SearchField from "../Components/SearchField";

class MobileSearchArea extends Component {

	handleSearchChange = (query) => {
		const { dispatch } = this.props
		dispatch({
			type: 'SEARCH',
			payload: {
				query,
				dispatch
			}
		})
	}

	render() {
		const {isLoading} = this.props

		return (
			<div className="mobile-search-field-container">
				<SearchField
					autoFocus={true}
					onChange={this.handleSearchChange}
					loading={isLoading}
				/>
			</div>
		)
	}
}


export default connect(state => ({
	isLoading: state.layout.getIn(['loading'])
}))(MobileSearchArea)
