import { Flex, FlexItem } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import {
	getFieldsTags,
	getWordpressTags,
	getFormTags,
	getOtherTags,
	getMetaTags,
} from './functions';

import { get, isEmpty, has } from 'lodash';

function TagList(props) {
	const { onSelect, data, noFields } = props;

	const mapList = (list) => {
		return !isEmpty(list)
			? list.map((tag, index) => {
					const title = get(tag, 'title');
					const Tag = get(tag, 'tag');

					return (
						<Flex
							className="formello-tag-option"
							onClick={() => onSelect(Tag)}
							key={index}
						>
							<FlexItem>
								<strong>{title}</strong>
							</FlexItem>
							<FlexItem>
								<span>{Tag}</span>
							</FlexItem>
						</Flex>
					);
			  })
			: null;
	};

	const getList = () => {
		const requiredList = props.list;

		switch (requiredList) {
			case 'fields':
				const fieldsTagList = isEmpty(data)
					? getFieldsTags(props.clientId)
					: data;
				return mapList(fieldsTagList);
			case 'wordpress':
				const wpTags = isEmpty(data) ? getWordpressTags() : data;
				return mapList(wpTags);
			case 'form':
				const formTags = isEmpty(data) ? getFormTags() : data;
				return mapList(formTags);
			case 'meta':
				const metaTags = isEmpty(data) ? getMetaTags() : data;
				return mapList(metaTags);
			case 'other':
				const otherTags = isEmpty(data) ? getOtherTags() : data;
				return mapList(otherTags);
		}
	};

	const listToMap = getList();

	return (
		<div>
			{!isEmpty(listToMap) ? (
				<Fragment>{listToMap}</Fragment>
			) : (
				<div>
					<h3>No Tags Found!</h3>
				</div>
			)}
		</div>
	);
}

export default TagList;
