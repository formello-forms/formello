import { ReactComponent as Logo } from '../../../assets/icons/logo.svg';
import { __experimentalHStack as HStack } from '@wordpress/components';

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
			</div>
		</div>
	);
}
