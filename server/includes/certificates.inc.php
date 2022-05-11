<?
function certificate($Starter1, $Starter2, $Team, $Place, $Image, $Senior) {

  $SOURCE = './source/Urkunde.svg';
  $TARGET = './certificates/';
  $NAME = $Place . ' - ' . $Team . '.jpg';
  $TEMP = './source/tmp.svg';
  $IMAGES = './images/';

  if ($Image) {
    $img = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($IMAGES . $Image));
  } else {
    $img = '';
  }
  
  $string = file_get_contents($SOURCE);
  $string = str_replace('[[[STARTER1]]]', $Starter1, $string);
  $string = str_replace('[[[STARTER2]]]', $Starter2, $string);
  $string = str_replace('[[[TEAM]]]', $Team, $string);
  $string = str_replace('[[[PLACE]]]', $Place, $string);
  $string = str_replace('[[[IMAGE]]]', $img, $string);
  $string = str_replace('[[[SENIOR]]]', $Senior ? '1' : '0', $string);

  $handle = fopen($TEMP, 'w');
  fputs($handle, $string);
  exec('convert "' . $TEMP . '" "' . $TARGET . $NAME . '"');
}
?>
