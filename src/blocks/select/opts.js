import {
	TextControl,
	CheckboxControl,
	Flex,
	FlexItem,
	Button,
} from '@wordpress/components';

import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const OptionsList = ( props ) => {
	const { options, onChange, showValue, deleteRow } = props;
	const dragItem = useRef();
	const dragOverItem = useRef();

	const dragStart = ( e, position ) => {
		dragItem.current = position;
	};

	const dragEnter = ( e, position ) => {
		dragOverItem.current = position;
	};

	const drop = () => {
		const copyListItems = [ ...options ];
		const dragItemContent = copyListItems[ dragItem.current ];
		copyListItems.splice( dragItem.current, 1 );
		copyListItems.splice( dragOverItem.current, 0, dragItemContent );
		dragItem.current = null;
		dragOverItem.current = null;
		props.changeOrder( copyListItems );
	};

	return options.map( ( obj, index ) => {
		return (
			<Flex
				key={ index }
				justify="flex-start"
				className={ 'formello-fields-row' }
				onDragStart={ ( e ) => dragStart( e, index ) }
				onDragEnter={ ( e ) => dragEnter( e, index ) }
				onDragEnd={ drop }
				draggable
			>
				<FlexItem>
					<CheckboxControl
						checked={ obj.selected }
						onChange={ ( val ) =>
							onChange( val, index, 'selected' )
						}
						__nextHasNoMarginBottom
					/>
				</FlexItem>
				{ showValue && (
					<FlexItem>
						<TextControl
							placeholder={ __( 'Value', 'formello' ) }
							value={ obj.value }
							onChange={ ( val ) =>
								onChange( val, index, 'value' )
							}
							__nextHasNoMarginBottom
						/>
					</FlexItem>
				) }
				<FlexItem>
					<TextControl
						placeholder={ __( 'Label', 'formello' ) }
						value={ obj.label }
						onChange={ ( val ) => onChange( val, index, 'label' ) }
						__nextHasNoMarginBottom
					/>
				</FlexItem>
				<FlexItem>
					<Button
						isSmall
						icon={ 'no' }
						iconSize={ 16 }
						onClick={ () => deleteRow( obj, index ) }
					/>
				</FlexItem>
			</Flex>
		);
	} );
};
export default OptionsList;
