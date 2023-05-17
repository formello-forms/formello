import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes, className } ) {

	const { name, options, type, required } = attributes;
	const blockProps = useBlockProps.save( {
		className,
	} );

	return (
		<div { ...blockProps }>
			{ options.map( ( opt, index ) => {
				return (
					<div key={ index } className={ 'formello formello-checkbox' }>
						<label>{ opt.label }</label>
						<input 
							value={ opt.value || opt.label } 
							name={ 'checkbox' === type ? name + '[]' : name } 
							checked={ opt.selected } 
							type={ type } 
							required={ required } 
						/>
					</div>
				);
			} ) }
		</div>
	);
}