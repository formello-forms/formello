/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { toggleFormat } = wp.richText;
const { RichTextToolbarButton, RichTextShortcut } = wp.editor;
const { registerFormatType } = wp.richText;

/**
 * Block constants
 */
const name = 'formello/small';

export const small = {
	name,
	title: __( 'small' ),
	tagName: 'small',
	className: null,
	attributes: {
		style: 'style',
	},
	edit( { isActive, value, onChange } ) {
		const onToggle = () => {
			onChange(
				toggleFormat( value, {
					type: name,
					attributes: {
						style: 'text-decoration: small;',
					},
				} ) 
			);
		};
		return (
			<Fragment>
				<RichTextShortcut
					type="primary"
					character="small"
					onUse={ onToggle }
				/>
				<RichTextToolbarButton
					icon="editor-small"
					title={ __( 'small' ) }
					onClick={ onToggle }
					isActive={ isActive }
					shortcutType="primary"
					shortcutCharacter="small"
				/>
			</Fragment>
		);

	},
};


registerFormatType( name, { ...small } );
