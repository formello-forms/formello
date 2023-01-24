import classnames from 'classnames';
import {
	useBlockProps,
	RichText,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
} from '@wordpress/block-editor';
import {
	Loading,
	Loading2,
	Loading3,
	Loading4,
	Loading5,
} from '../../icons/icons';

const v1 = 
	{
		attributes: {
			"text": {
				"type": "string",
				"default": "Submit"
			},
			"type": {
				"type": "string",
				"default": "Loading"
			},
			"alignment": {
				"type": "string",
				"default": "left"
			},
			"style": {
				"type": "object",
				"default": {
					"color": {
						"background": "#000000",
						"text": "#ffffff"
					},
					"padding": {
						"top": "10"
					}
				}
			}
		},
		save( { attributes, className } ) {

			const { text, alignment, type, style } = attributes;

			const icons = {
				Loading,
				Loading2,
				Loading3,
				Loading4,
				Loading5,
			};

			const ButtonIcon = icons[ type ];
			const borderRadius = style?.border?.radius;
			const borderProps = getBorderClassesAndStyles( attributes );

			// Check for old deprecated numerical border radius. Done as a separate
			// check so that a borderRadius style won't overwrite the longhand
			// per-corner styles.
			if ( typeof borderRadius === 'number' ) {
				borderProps.style.borderRadius = `${ borderRadius }px`;
			}

			const colorProps = getColorClassesAndStyles( attributes );

			const buttonClasses = classnames( colorProps.className, alignment );

			const blockProps = useBlockProps.save( {
				className: buttonClasses,
				style: colorProps.style
			} );

			return (
				<button type="submit" { ...blockProps }>
					<RichText.Content tagName="span" value={ text } />
					<ButtonIcon />
				</button>
			);

		}
	};

const deprecated = [ v1 ]

export default deprecated;
