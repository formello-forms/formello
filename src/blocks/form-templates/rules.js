import {
  TextControl,
  PanelRow,
  PanelBody,
  Button,
  SelectControl,
  Icon,
  Flex,
  Dropdown,
  FormTokenField
} from '@wordpress/components';
import { __experimentalInputControl as InputControl } from '@wordpress/components';
import './editor.scss';
const {
	apiFetch,
} = wp;
import { useState, useEffect } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

const RulesList = props => {

	const [ posts, setPosts ] = useState([]);

	useEffect(
		() => {
			apiFetch( {
				path: '/wp/v2/posts',
				method: 'GET'
			} ).then( ( result ) => {
				setPosts( result )
			} );	
		},
		[]
	);

	return props.options.map((obj, idx) => {

		let name = obj.name,
			where = obj.where,
			condition = obj.condition,
			operator = obj.operator,
			selectedPosts = obj.selectedPosts;

		let postsFieldValue = [];

		let postNames = posts.map( ( post ) => post.title.rendered );

		postsFieldValue = selectedPosts.map( ( postId ) => {
			let wantedPost = posts.find( ( post ) => {
				return post.id === postId;
			} );
			if ( wantedPost === undefined || ! wantedPost ) {
				return false;
			}
			return wantedPost.title.rendered;
		} );

		return (
			<div key={idx}>
				<div className='formello-rules'>
					<span>{ name } - { idx+1 }</span>
				    <Dropdown
				        position="top center"
				        renderToggle={ ( { isOpen, onToggle } ) => (
				            <Button 
				            	isSmall
				            	icon={ 'admin-tools' } 
								onClick={ onToggle }
				            	aria-expanded={ isOpen }
				            />
				        ) }
				        renderContent={ () => (
				        	<div className="formello-dropdown-rules">
					        	<p>Choose where the form should be displayed.</p>
							    <SelectControl
							        label={ __( 'Show', 'formello' ) }
							        value={ where }
							        options={ [
							        	{ value: 'after', label: 'after content' },
							        	{ value: 'inside', label: 'inside content' },
							        ] }
									onChange={ (val) => { props.onChange( val, idx, 'where' ) } } 
							    />
							    <SelectControl
							        label={ __( 'Condition', 'formello' ) }
							        value={ condition }
							        options={ [
							        	{ value: 'everywhere', label: 'everywhere' },
							        	{ value: 'post', label: 'if post' },
							        	{ value: 'page', label: 'if page' },
							        	{ value: 'category', label: 'if category' },
							        ] }
									onChange={ (val) => { 
										props.onChange( val, idx, 'condition' )
										console.log(val)
										apiFetch( {
											path: '/wp/v2/posts',
											method: 'GET'
										} ).then( ( result ) => {
											console.log(result)
											setPosts( result )
										} );
									} } 
							    />
							    {
							    	'everywhere' !== condition &&
								    <SelectControl
								        label={ __( 'Operator', 'formello' ) }
								        value={ operator }
								        options={ [
								        	{ value: 'is', label: 'is' },
								        	{ value: 'isnot', label: 'is not' },
								        ] }
										onChange={ (val) => { props.onChange( val, idx, 'operator' ) } } 
								    />
							    }
							    <FormTokenField 
					    			label={ 'everywhere' === condition ? __( 'Excluded pages/posts', 'formello' ) : __( 'Selected pages/posts', 'formello' ) }
									value={ postsFieldValue }
							        suggestions={ postNames } 
							        onChange={ ( selectedPosts ) => { 
										// Build array of selected posts.
										let selectedPostsArray = [];
										selectedPosts.map(
											( postName ) => {
												const matchingPost = posts.find( ( post ) => {
													return post.title.rendered === postName;
												} );
												if ( matchingPost !== undefined ) {
													selectedPostsArray.push( matchingPost.id );
												}
											}
										)
							        	props.onChange( selectedPostsArray, idx, 'selectedPosts' )
							        } }
									maxSuggestions={ 5 }
							    />			        	
				        	</div>
				        ) }
				    />
					<Button
						icon='no'
						onClick={ () => props.delete(obj, idx) }
					/>
				</div>
			</div>
		);
	});
};
export default RulesList;