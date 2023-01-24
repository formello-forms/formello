/**
 * WordPress dependencies
 */
import { 
	useSelect,
	store as coreStore,
} from '@wordpress/data';
import {
	parse,
} from '@wordpress/blocks';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';

function usePatternsSetup( clientId, blockName, filterPatternsFn ) {
	return useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				__experimentalBlockPatterns,
				__experimentalGetPatternsByBlockTypes,
				__experimentalGetAllowedPatterns,
				getSettings,
			} = select( blockEditorStore );
			const allPatterns = getSettings().__experimentalBlockPatterns;
			const normalizedBlockNames = Array.isArray( blockName )
				? blockName
				: [ blockName ];

			const patterns = allPatterns.filter( ( pattern ) => 
					pattern?.blockTypes?.some?.( ( name ) => 
						normalizedBlockNames.includes( name )
					)
				);

			if ( filterPatternsFn ) {
				return patterns.filter(
					filterPatternsFn
				);
			}
			return patterns
				.map( ( pattern ) => {
					return {
						...pattern,
						blocks: parse( pattern.content, {
							__unstableSkipMigrationLogs: true,
						} ),
					};
				});

		},
		[ clientId, blockName, filterPatternsFn ]
	);
}

export default usePatternsSetup;