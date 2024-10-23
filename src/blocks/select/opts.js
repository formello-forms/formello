import {
	TextControl,
	CheckboxControl,
	Flex,
	FlexItem,
	Button,
	Tooltip,
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
					<Tooltip
						text={ __( 'Mark selected', 'formello' ) }
						delay="200"
					>
						<CheckboxControl
							checked={ obj.selected }
							onChange={ ( val ) =>
								onChange( val, index, 'selected' )
							}
							__nextHasNoMarginBottom
						/>
					</Tooltip>
				</FlexItem>
				{ showValue && (
					<FlexItem>
						<Tooltip
							text={ __( 'The value of the option', 'formello' ) }
							delay="200"
						>
							<TextControl
								placeholder={ __( 'Value', 'formello' ) }
								value={ obj.value }
								onChange={ ( val ) =>
									onChange( val, index, 'value' )
								}
								__nextHasNoMarginBottom
							/>
						</Tooltip>
					</FlexItem>
				) }
				<FlexItem>
					<Tooltip
						text={ __( 'The label of the option', 'formello' ) }
						delay="200"
					>
						<TextControl
							placeholder={ __( 'Label', 'formello' ) }
							value={ obj.label }
							onChange={ ( val ) =>
								onChange( val, index, 'label' )
							}
							__nextHasNoMarginBottom
						/>
					</Tooltip>
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
