import { TextControl, Flex, FlexItem, Button } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

const OptionsList = ( props ) => {
	return props.options.map( ( obj, index ) => {
		return (
			<Flex key={ index } justify="flex-start">
				{ props.showValue && (
					<FlexItem>
						<TextControl
							placeholder={ __( 'Value', 'formello' ) }
							value={ obj.value }
							onChange={ ( val ) =>
								props.onChange( val, index, 'value' )
							}
						/>
					</FlexItem>
				) }
				<FlexItem>
					<TextControl
						placeholder={ __( 'Label', 'formello' ) }
						value={ obj.label }
						onChange={ ( val ) => props.onChange( val, index, 'label' ) }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						isSmall
						icon={ 'no' }
						iconSize={ 16 }
						onClick={ () => props.delete( obj, index ) }
					/>
				</FlexItem>
			</Flex>
		);
	} );
};
export default OptionsList;
