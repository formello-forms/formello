/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { layout } from '@wordpress/icons';
import { TemplatesModal } from './library';
import { useState } from '@wordpress/element';

function BlockVariationPicker( {
	icon = layout,
	label = __( 'Choose variation' ),
	instructions = __( 'Select a variation to start with.' ),
	variations,
	onSelect,
	allowSkip,
	clientId,
} ) {
	const classes = classnames( 'block-editor-block-variation-picker', {
		'has-many-variations': variations.length > 4,
	} );
	const [ isModalOpen, setModalOpen ] = useState( false );

	return (
		<Placeholder
			icon={ icon }
			label={ label }
			instructions={ instructions }
			className={ classes }
		>
			{ /*
			 * Disable reason: The `list` ARIA role is redundant but
			 * Safari+VoiceOver won't announce the list otherwise.
			 */
			/* eslint-disable jsx-a11y/no-redundant-roles */ }
			<ul
				className="block-editor-block-variation-picker__variations"
				role="list"
				aria-label={ __( 'Block variations', 'formello' ) }
			>
				{ variations.map( ( variation ) => (
					<li key={ variation.name }>
						<Button
							isSecondary
							icon={ variation.icon }
							iconSize={ 48 }
							onClick={ () => onSelect( variation ) }
							className="block-editor-block-variation-picker__variation"
							label={ variation.description || variation.title }
						/>
						<span
							className="block-editor-block-variation-picker__variation-label"
							role="presentation"
						>
							{ variation.title }
						</span>
					</li>
				) ) }
			</ul>

			{ /* eslint-enable jsx-a11y/no-redundant-roles */ }
			{ allowSkip && (
				<div className="block-editor-block-variation-picker__skip">
					<Button
						className="plugin-formello-panel-button is-large"
						isPrimary
						onClick={ () => {
							setModalOpen( 'templates' );
						} }
					>
						{ __( 'Open Library', 'formello' ) }
					</Button>
					<Button isLink onClick={ () => onSelect() }>
						{ __( 'Skip', 'formello' ) }
					</Button>
				</div>
			) }

			{ 'templates' === isModalOpen && (
				<TemplatesModal
					type={ 'remote' }
					onRequestClose={ () => setModalOpen( false ) }
					clientId={ clientId }
				/>
			) }
		</Placeholder>
	);
}

export default BlockVariationPicker;
