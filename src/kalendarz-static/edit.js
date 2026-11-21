/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { plus, trash } from '@wordpress/icons';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl, Button } from '@wordpress/components';
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
 * @param {Object}   root0               The props passed to the edit function.
 * @param {Object}   root0.attributes    The block attributes.
 * @param {Function} root0.setAttributes Function to update block attributes.
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { year, month, events } = attributes;
	const dayNames = [
		__( 'Poniedziałek', 'kalendarz-static' ),
		__( 'Wtorek', 'kalendarz-static' ),
		__( 'Środa', 'kalendarz-static' ),
		__( 'Czwartek', 'kalendarz-static' ),
		__( 'Piątek', 'kalendarz-static' ),
		__( 'Sobota', 'kalendarz-static' ),
		__( 'Niedziela', 'kalendarz-static' ),
	];
	const firstDay = new Date( 0 );
	firstDay.setFullYear( year, month - 1, 1 );
	const offset = ( firstDay.getDay() + 6 ) % 7;
	const lastDay = new Date( firstDay );
	lastDay.setMonth( month, 0 );
	const numberOfDays = lastDay.getDate();
	const weeks = Array.from(
		{ length: Math.ceil( ( offset + numberOfDays ) / 7 ) },
		( _, weekIndex ) =>
			Array.from( { length: 7 }, ( unused, dayIndex ) => {
				const day = weekIndex * 7 + dayIndex - offset + 1;
				return day > 0 && day <= numberOfDays ? day : null;
			} )
	);
	const indexedEvents = events.map( ( event, index ) => ( {
		...event,
		index,
	} ) );
	const outsideEvents = indexedEvents.filter(
		( event ) => event.day < 1 || event.day > numberOfDays
	);

	const updateEvent = ( index, key, value ) => {
		const newEvents = [ ...events ];
		newEvents[ index ] = { ...newEvents[ index ], [ key ]: value };
		setAttributes( { events: newEvents } );
	};

	const addEvent = ( day ) => {
		setAttributes( {
			events: [ ...events, { day, title: '' } ],
		} );
	};

	const removeEvent = ( index ) => {
		const newEvents = events.filter( ( _, i ) => i !== index );
		setAttributes( { events: newEvents } );
	};

	const renderEvent = ( event ) => (
		<div className="kalendarz-editor-event" key={ event.index }>
			<TextControl
				label={ __( 'Tytuł wydarzenia', 'kalendarz-static' ) }
				hideLabelFromVision
				value={ event.title }
				onChange={ ( value ) =>
					updateEvent( event.index, 'title', value )
				}
				__nextHasNoMarginBottom
			/>
			<Button
				icon={ trash }
				label={ __( 'Usuń wydarzenie', 'kalendarz-static' ) }
				showTooltip
				isDestructive
				onClick={ () => removeEvent( event.index ) }
			/>
		</div>
	);

	return (
		<div { ...useBlockProps( { className: 'kalendarz-editor' } ) }>
			<div className="kalendarz-editor-settings">
				<SelectControl
					label={ __( 'Miesiąc', 'kalendarz-static' ) }
					value={ month }
					options={ [
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
					] }
					onChange={ ( val ) =>
						setAttributes( { month: parseInt( val, 10 ) } )
					}
				/>
				<TextControl
					label={ __( 'Rok', 'kalendarz-static' ) }
					type="number"
					min="1"
					max="9999"
					value={ year }
					onChange={ ( val ) =>
						setAttributes( {
							year: Math.min(
								9999,
								Math.max( 1, parseInt( val, 10 ) || year )
							),
						} )
					}
				/>
			</div>
			<div
				className="kalendarz-editor-scroll"
				tabIndex={ 0 }
				role="region"
				aria-label={ __( 'Kalendarz wydarzeń', 'kalendarz-static' ) }
			>
				<table className="kalendarz-editor-table">
					<caption className="screen-reader-text">
						{ __( 'Kalendarz', 'kalendarz-static' ) }: { month }/
						{ year }
					</caption>
					<thead>
						<tr>
							{ dayNames.map( ( name ) => (
								<th key={ name } scope="col">
									{ name }
								</th>
							) ) }
						</tr>
					</thead>
					<tbody>
						{ weeks.map( ( week, weekIndex ) => (
							<tr key={ weekIndex }>
								{ week.map( ( day, dayIndex ) => (
									<td key={ dayIndex }>
										{ day !== null && (
											<>
												<div className="kalendarz-editor-day">
													<strong>{ day }</strong>
													<Button
														icon={ plus }
														label={ `${ __( 'Dodaj wydarzenie: dzień', 'kalendarz-static' ) } ${ day }` }
														showTooltip
														onClick={ () =>
															addEvent( day )
														}
													/>
												</div>
												{ indexedEvents
													.filter(
														( event ) =>
															Number(
																event.day
															) === day
													)
													.map( renderEvent ) }
											</>
										) }
									</td>
								) ) }
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
			{ outsideEvents.length > 0 && (
				<div className="kalendarz-editor-outside">
					<h3>
						{ __(
							'Wydarzenia poza wybranym miesiącem',
							'kalendarz-static'
						) }
					</h3>
					{ outsideEvents.map( ( event ) => (
						<div key={ event.index }>
							<TextControl
								label={ __(
									'Dzień miesiąca',
									'kalendarz-static'
								) }
								type="number"
								min="1"
								max={ numberOfDays }
								value={ event.day }
								onChange={ ( value ) =>
									updateEvent(
										event.index,
										'day',
										Math.min(
											numberOfDays,
											Math.max(
												1,
												parseInt( value, 10 ) || 1
											)
										)
									)
								}
							/>
							{ renderEvent( event ) }
						</div>
					) ) }
				</div>
			) }
		</div>
	);
}
