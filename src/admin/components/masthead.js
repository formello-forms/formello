/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { ReactComponent as Logo } from '../../../assets/icons/logo.svg';
import {
	__experimentalHStack as HStack,
	withFilters,
} from '@wordpress/components';

export const HeaderSlot = withFilters( 'formello.header.slot' )( () => {
	return null;
} );

export default function Header( { title, className, children } ) {
	return (
		<div className="masthead">
			<div className={ `inner-container ${ className }` }>
				<HStack
					justify="flex-start"
					expanded={ false }
					spacing={ 2 }
					className="masthead__branding"
				>
					<Logo />
					<h1>{ title }</h1>
					{ children }
				</HStack>
				<HStack expanded={ false }>
					<HeaderSlot />
				</HStack>
			</div>
		</div>
	);
}
