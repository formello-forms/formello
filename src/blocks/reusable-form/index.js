import getIcon from '../../utils/get-icon';
const { __ } = wp.i18n;
import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';

registerBlockType('formello/form-reusable', {
	title: __('Form Library'),
	description: __('Block showing all locally registered Formello forms'),
	category: 'formello',
	attributes: {
		id: {
			type: 'number'
		}
	},
	supports: {
		html: false
	},
  	icon: getIcon('form'),

  	edit: edit,

	save: ( props ) => {
		return null
	}
})