import {
  TextControl,
  PanelRow,
  PanelBody,
  Button,
  SelectControl,
  Icon,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import MergeTags from '../../components/merge-tags';

const OptionsList = props => {

  return props.options.map((obj, idx) => {

	let key = obj.key,
		value = obj.value;
	return (
		<fieldset className="formello-fieldset" key={idx}>
			<TextControl
				label={ __( 'Name', 'formello' ) }
				placeholder={ __( 'Name', 'formello' ) }
				value={ key }
				onChange={ (val) => { props.onChange( val, idx, 'key' ) } } 
			/>
			<MergeTags  
				label={ __( 'Value', 'formello' ) }
				clientId={ props.clientId }
				placeholder={ __( 'Value', 'formello' ) }
				value={ value }
				onChange={ (val) => { 
				  props.onChange( val, idx, 'value' ) 
				} } 
			/>
			<Button
				isDestructive
				isSmall
				onClick={ () => props.delete(obj, idx) }
			>Delete
			</Button>
		</fieldset>
	);
  });
};
export default OptionsList;
