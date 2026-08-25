<?php
$year = isset($attributes['year']) ? intval($attributes['year']) : intval(date('Y'));
$month = isset($attributes['month']) ? intval($attributes['month']) : intval(date('m'));
$events = isset($attributes['events']) ? $attributes['events'] : [];

$events_by_day = [];
foreach ($events as $event) {
	if (isset($event['day'])) {
		$events_by_day[intval($event['day'])][] = $event;
	}
}

$first_day_of_month = mktime(0, 0, 0, $month, 1, $year);
$number_of_days = intval(date('t', $first_day_of_month));
$day_of_week = intval(date('N', $first_day_of_month)); // 1 monday, 7 sunday

$day_names = [
	1 => 'Poniedziałek',
	2 => 'Wtorek',
	3 => 'Środa',
	4 => 'Czwartek',
	5 => 'Piątek',
	6 => 'Sobota',
	7 => 'Niedziela'
];

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-kalendarz-static']);
?>

<div class="container my-4 wp-block-kalendarz-static-kalendarz-static">
	<div class="row d-none d-md-flex text-center font-weight-bold bg-light border-bottom">
		<div class="col text-day bg-transparent"><?php echo esc_html($day_names[1]); ?></div>
		<div class="col text-day bg-transparent"><?php echo esc_html($day_names[2]); ?></div>
		<div class="col text-day bg-transparent"><?php echo esc_html($day_names[3]); ?></div>
		<div class="col text-day bg-transparent"><?php echo esc_html($day_names[4]); ?></div>
		<div class="col text-day bg-transparent"><?php echo esc_html($day_names[5]); ?></div>
		<div class="col text-day-6 bg-transparent"><?php echo esc_html($day_names[6]); ?></div>
		<div class="col text-day-7 bg-transparent"><?php echo esc_html($day_names[7]); ?></div>
	</div>

	<div class="row border-left text-left font-weight-bold">
		<?php
			// empty days before 1st day of month
			for ($i = 1; $i < $day_of_week; $i++) {
				echo '<div class="col-cal d-none d-md-block border-right border-bottom bg-light">';
				echo '<div class="p-1 text-day-none">&nbsp;</div>';
				echo '</div>';
			}

			for ($day = 1; $day <= $number_of_days; $day++) {
				$has_events = isset($events_by_day[$day]);
				$dow = ($day_of_week + $day - 2) % 7 + 1;
				$dow_class = $dow >= 6 ? '-' . $dow : '';
				$dow_day = $day_names[$dow];

				if ($has_events) {
					echo '<div class="col-12 col-cal p-0 d-block border-right border-bottom">';
					echo '<div class="p-1 text-day' . esc_html($dow_class) . ' d-flex justify-content-between align-items-center">' . $day . ' <span class="d-md-none">' . esc_html($dow_day) . '</span></div>';
					foreach ($events_by_day[$day] as $ev) {
						echo '<div class="m-1 py-1 alert bg-day' . esc_html($dow_class) . ' text-center"><strong>' . esc_html($ev['title'] ?? '') . '</strong></div>';
					}
					echo '</div>';
				} else {
					echo '<div class="col-cal d-none d-md-block border-right border-bottom bg-light"><div class="p-1 text-day' . esc_html($dow_class) . '">' . $day . '</div></div>';
				}
			}
		?>
	</div>
</div>
