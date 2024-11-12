import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes, className } ) {
	const { name, options, type, required } = attributes;
	const blockProps = useBlockProps.save( {
		className,
	} );

	return (
		<div { ...blockProps }>
			{ options.map( ( opt, index ) => {
				const id = name + '-' + index;
				return (
					<div key={ index } className={ 'wp-block-formello-input' }>
						<label htmlFor={ id }>{ opt.label }</label>
						<input
							value={ opt.value || opt.label }
							name={ 'checkbox' === type ? name + '[]' : name }
							checked={ opt.selected }
							type={ type }
							required={ required }
							id={ id }
							data-wp-on--input="actions.validateInput"
							data-wp-on--blur="actions.validateInput"
							data-wp-on--invalid="actions.validateInput"
						/>
					</div>
				);
			} ) }
		</div>
	);
}
