import {
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Avoid set post dirty on pattern preview.
 */
const FormPreview = ( props ) => {
	const { clientId, attributes, setAttributes } = props;

	const blockProps = useBlockProps();

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps );

	return (
		<div { ...innerBlocksProps }>
			{ children }
		</div>
	);

};

export default FormPreview;
