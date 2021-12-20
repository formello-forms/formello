/**
 * Import CSS
 */
//import './editor.scss';

/**
 * External dependencies
 */
import Masonry from 'react-masonry-component';
import classnames from 'classnames';
import LazyLoad from 'react-lazyload';

/**
 * WordPress dependencies
 */
import {
	Fragment,
	RawHTML,
	useState,
} from '@wordpress/element';

import {
	__,
	sprintf,
} from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import {
	compose,
} from '@wordpress/compose';

import {
	decodeEntities,
} from '@wordpress/html-entities';

import {
	withSelect,
	useDispatch,
	useSelect
} from '@wordpress/data';

import {
	parse,
} from '@wordpress/blocks';

import {
	TabPanel,
	Spinner,
	SelectControl,
	Modal,
	Button
} from '@wordpress/components';
import { BlockPreview } from '@wordpress/block-editor';
const {
	applyFilters,
} = wp.hooks;

import MergeTags from '../../components/merge-tags';

export function ActionsModal ( props ) {

	const {
		onRequestClose,
		action,
		clientId,
		actionId,
		attributes,
		setAttributes,
	} = props;

	const handleUpdate = ( settings ) => {
		// 1. Make a shallow copy of the items
		let items = [...attributes.actions];
		// 2. Make a shallow copy of the item you want to mutate
		items[actionId] = settings;

		setAttributes( { actions: items } );
	}

	const deleteAction = () => {

		let items = [...attributes.actions]; // make a separate copy of the array
		items.splice(actionId, 1);
		setAttributes( { actions: items } );
		onRequestClose()

	}

	return (
		<Modal
			title={ action.title }
			position="top"
			size="lg"
			onRequestClose={ onRequestClose }
		>
			<Fragment>

				{ applyFilters( 'formello.modal.' + action.type, '', props, MergeTags, handleUpdate ) }

				<div className="formello-modal-buttons">
					<Button
						isDestructive={ true }
						onClick={ () => {
							deleteAction()
						} }
					>Delete</Button>

					<Button
						isPrimary={ true }
						onClick={ () => {
							onRequestClose()
						} }
					>Save</Button>
				</div>
			</Fragment>
		</Modal>
	);
}