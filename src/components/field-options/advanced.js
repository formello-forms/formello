/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	BaseControl,
	__experimentalInputControl as InputControl,
	withFilters,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';

import { SUPPORTED_ATTRIBUTES } from './constants';
import DatepickerSettings from './date';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param  props
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function AdvancedOptions(props) {
	const {
		attributes: {
			type,
			min,
			max,
			advancedDate,
			step,
			minlength,
			maxlength,
			validation,
			disabled,
			readOnly,
			withButton,
			withOutput,
			grouped,
			flatpickr,
			cols,
			rows,
			enableRtf,
			pattern,
		},
		setAttributes,
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[type];

	return (
		<Fragment>
			{'date' === type && (
				<ToggleControl
					label={__(
						'Advanced Date',

						'formello'
					)}
					checked={advancedDate}
					onChange={(val) => {
						setAttributes({ advancedDate: val });
					}}
				/>
			)}
			<DatepickerSettings {...props} />
			{supported.includes('step') && (
				<Fragment>
					<BaseControl>
						<InputControl
							label={__('Min Value', 'formello')}
							value={min || ''}
							min={'0'}
							type={'range' === type ? 'number' : type}
							onChange={(val) => {
								setAttributes({ min: val });
								setAttributes({
									flatpickr: {
										...flatpickr,
										'min-date': val,
									},
								});
							}}
						/>
					</BaseControl>
					<BaseControl>
						<InputControl
							label={__('Max Value', 'formello')}
							value={max || ''}
							type={'range' === type ? 'number' : type}
							onChange={(val) => {
								setAttributes({ max: val });
								setAttributes({
									flatpickr: {
										...flatpickr,
										'max-date': val,
									},
								});
							}}
						/>
					</BaseControl>
					<BaseControl>
						<InputControl
							type="number"
							label={__('Step Value', 'formello')}
							value={step || ''}
							onChange={(val) => setAttributes({ step: val })}
						/>
					</BaseControl>
				</Fragment>
			)}
			{supported.includes('minlength') && true !== advancedDate && (
				<Fragment>
					<BaseControl>
						<InputControl
							type="number"
							label={__('Min Characters', 'formello')}
							value={minlength || ''}
							onChange={(val) =>
								setAttributes({ minlength: Number(val) })
							}
						/>
					</BaseControl>
					<BaseControl>
						<InputControl
							type="number"
							label={__('Max Characters', 'formello')}
							value={maxlength || ''}
							onChange={(val) =>
								setAttributes({ maxlength: Number(val) })
							}
						/>
					</BaseControl>
				</Fragment>
			)}
			{supported.includes('pattern') && true !== advancedDate && (
				<Fragment>
					<BaseControl>
						<InputControl
							label={__('Pattern', 'formello')}
							value={pattern || ''}
							onChange={(val) => setAttributes({ pattern: val })}
						/>
					</BaseControl>
				</Fragment>
			)}
			{'hidden' !== type && (
				<BaseControl>
					<InputControl
						label={__('Custom Validation Message', 'formello')}
						value={validation}
						onChange={(val) => setAttributes({ validation: val })}
					/>
				</BaseControl>
			)}
			{'textarea' === type && (
				<Fragment>
					<BaseControl>
						<InputControl
							type="number"
							label={__('Cols', 'formello')}
							value={cols}
							onChange={(val) =>
								setAttributes({ cols: Number(val) })
							}
						/>
					</BaseControl>
					<BaseControl>
						<InputControl
							type="number"
							label={__('Rows', 'formello')}
							value={rows}
							onChange={(val) =>
								setAttributes({ rows: Number(val) })
							}
						/>
					</BaseControl>
					<BaseControl>
						<ToggleControl
							label={__('Enable Rich Text', 'formello')}
							checked={enableRtf}
							onChange={(newval) =>
								setAttributes({ enableRtf: newval })
							}
						/>
					</BaseControl>
				</Fragment>
			)}
			{'hidden' !== type && (
				<Fragment>
					<ToggleControl
						label={__('Disabled', 'formello')}
						checked={disabled}
						onChange={(newval) =>
							setAttributes({ disabled: newval })
						}
					/>
					<ToggleControl
						label={__('Read only', 'formello')}
						checked={readOnly}
						onChange={(newval) =>
							setAttributes({ readOnly: newval })
						}
					/>
				</Fragment>
			)}
			{['text', 'url', 'email', 'number', 'tel'].includes(type) && (
				<Fragment>
					<ToggleControl
						label={__('Show button', 'formello')}
						checked={withButton}
						onChange={(newval) =>
							setAttributes({ withButton: newval })
						}
					/>
				</Fragment>
			)}
			{withButton && (
				<ToggleControl
					label={__('Group button with input', 'formello')}
					checked={grouped}
					onChange={(val) =>
						setAttributes({
							grouped: val,
						})
					}
				/>
			)}
			{'range' === type && (
				<ToggleControl
					label={__('Show output', 'formello')}
					checked={withOutput}
					onChange={(val) =>
						setAttributes({
							withOutput: val,
						})
					}
				/>
			)}
			{'hidden' === type && (
				<p>No advanced options for this field type.</p>
			)}
		</Fragment>
	);
}

export default withFilters('formello.advancedOptions')(AdvancedOptions);
