import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const FormPreview = () => {
	const blockProps = useBlockProps();

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps );

	return <div { ...innerBlocksProps }>{ children }</div>;
};

export default FormPreview;
