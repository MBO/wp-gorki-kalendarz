/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, Button } from '@wordpress/components';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { year, month, events } = attributes;

	const updateEvent = (index, key, value) => {
		const newEvents = [...events];
		newEvents[index] = { ...newEvents[index], [key]: value };
		setAttributes({ events: newEvents });
	}

	const addEvent = () => {
		setAttributes({
			events: [...events, {day: 1, title: '', desc: '' }]
		})
	}

	const removeEvent = (index) => {
		const newEvents = events.filter((_, i) => i !== index);
		setAttributes({ events: newEvents });
	}

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={__('Ustawienie Kalendarza', 'kalendarz-static')} initialOpen={true}>
					<SelectControl
						label={__('Miesiąc', 'kalendarz-static')}
						value={month}
						options={[
							{ label: 'Styczeń', value: 1 },
							{ label: 'Luty', value: 2 },
							{ label: 'Marzec', value: 3 },
							{ label: 'Kwiecień', value: 4 },
							{ label: 'Maj', value: 5 },
							{ label: 'Czerwiec', value: 6 },
							{ label: 'Lipiec', value: 7 },
							{ label: 'Sierpień', value: 8 },
							{ label: 'Wrzesień', value: 9 },
							{ label: 'Październik', value: 10 },
							{ label: 'Listopad', value: 11 },
							{ label: 'Grudzień', value: 12 },
						]}
						onChange={(val) => setAttributes({ month: parseInt(val, 10)})}
					/>
					<TextControl
						label={__('Rok', 'kalendarz-static')}
						type="number"
						value={year}
						onChange={(val) => setAttributes({ year: parseInt(val, 10) || 2026})}
					/>
				</PanelBody>
				<PanelBody title={__('Wydarzenia', 'kalendarz-static')} intiaialOpen={true}>
					{events.map((event, index) =>(
						<div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
							<TextControl
								label={__('Dzień miesiąca', 'kalendarz-static')}
								type="number"
								min="1"
								max="31"
								value={event.day}
								onChange={(val) => updateEvent(index, 'day', parseInt(val, 10) || 1)}
							/>
							<TextControl
								label={__('Tytuł wydarzenia', 'kalendarz-static')}
								value={event.title}
								onChange={(val) => updateEvent(index, 'title', val)}
							/>
							<Button isDestructive onClick={() => removeEvent(index)}>
								{__('Usuń', 'kalendarz-static')}
							</Button>
						</div>
					))}
					<Button isPrimary onClick={addEvent}>
						{__('Dodaj wydarzenie', 'kalendarz-static')}
					</Button>
				</PanelBody>
			</InspectorControls>

			{/* Preview */}
			<div className="kalendarz-preview-placeholder">
				<strong>Kalendarz:</strong> {month}/{year} (Liczba wydarzeń: {events.length})
				<p style={{fontSize: '12px', color: '#666'}}>Skonfiguruj dni i wydarzenia w panelu bocznym po prawej stronie.</p>
				<ul>
					{events.map((event, index) => (
						<li key={index}>
							<strong>{event.day}</strong> - <strong>{event.title}</strong>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
