<?
function certificate($Starter1, $Starter2, $Team, $Place, $Image, $Senior) {

  $SOURCE = './source/Urkunde.svg';
  $TARGET = './certificates/';
  $NAME = $Place . ' - ' . $Team . '.jpg';
  $TEMPSVG = './source/tmp.svg';
  $TEMPIMG = './source/tmp.jpg';

  if ($Image) {
    $img = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($Image));
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

  $handle = fopen($TEMPSVG, 'w');
  fputs($handle, $string);
  exec('convert "' . $TEMPSVG . '" "' . $TARGET . $NAME . '"');
}

function certHeader() {
  echo <<<EOD
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {
        font-family: sans-serif;
        font-size: 14px;
        background: white;
        color: black;
        text-align: center;
        overflow: hidden;
      }
      #progress {
        display: block;
        margin: 16px;
        height: 8px;
        width: 256px;
        border: 1px solid #DDDDDD;
        position: relative;
        overflow: hidden;
        border-radius: 3px;
      }
      #bar {
        height: 100%;
        background: #244676;
        position: absolute;
        top: 0;
        left: 0;
      }
      a {
        background: #AA0000;
        color: white;
        text-decoration: none;
        padding: 4px 8px;
        border-radius: 3px;
        display: inline-block;
        margin-top: 12px;
      }
    </style>
  </head>
  <body>
    <div id=header>Generiere Urkunden...</div>
    <div id=progress><div id=bar></div></div>
    <div id=info></div>
EOD;
}

function certFooter() {
  echo '<a href="./certificates/Urkunden.zip">Urkunden herunterladen</a></body></html>';
}
?>
