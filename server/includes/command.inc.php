<?
function sortTeams($a, $b) {
  if ($a['points'] == $b['points']) {
    return 0;
  }
  return ($a['points'] > $b['points']) ? -1 : 1;
}

function handleRequest($data, $user, $role) {
  global $SQL, $_ERROR, $_CONFIG;
  $error = '';

  switch($data['action']) {
    case 'uploadTeamImage':
      $team = $SQL->fetchArray('SELECT image FROM teams WHERE ID=' . $data['id']);

      $image_parts = explode(";base64,", $data['data']);
      $image_type_aux = explode("image/", $image_parts[0]);
      $image_type = $image_type_aux[1];
      $image_base64 = base64_decode($image_parts[1]);
      $fname = 'team_' . $data['id'] . '_' . md5($data['data']) . '.' . $image_type;
      $file = $_CONFIG['upload'] . $fname;
      if ($team['image'])
        unlink($_CONFIG['upload'] . $team['image']);
      if (file_put_contents($file, $image_base64)) {
        $SQL->query('UPDATE teams SET image=\'' . $fname . '\' WHERE ID = ' . $data['id']);
      } else {
        $error = 'Upload failed';
      }
      break;
    case 'editTeam':
      $d = [ 'paid'=>$data['paid'] ];
      $query = $SQL->buildUpdateQuery('teams', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editStarter':
      $d = [ 'g263'=>$data['g263'], 'disclaimer'=>$data['disclaimer'] ];
      $query = $SQL->buildUpdateQuery('starters', $d, 'WHERE ID = ' . $SQL->escape($data['id']));
      $SQL->query($query);
      $error = $SQL->lastError();
      break;
    case 'editConfig':
      if (isset($data['started'])) {
        $query = 'UPDATE config SET value=\'' . $SQL->escape($data['started']) . '\' WHERE name = \'started\'';
        $error=$query;
        $SQL->query($query);
      }
      if (isset($data['ended'])) {
        $query = 'UPDATE config SET value=\'' . $SQL->escape($data['ended']) . '\' WHERE name = \'ended\'';
        $error=$query;
        $SQL->query($query);
      }
      $error = $SQL->lastError();
      break;
    case 'certificates':
      include('includes/certificates.inc.php');
      $M = getCommandModel();
      $oldest = array('date' => 0, 'team' => '');
      // calc points and oldest
      foreach($M['teams'] as $team => $T) {
        $points = 1000.0;
        foreach($M['disciplines'] as $disc => $D) {
          $points -= floatval($T['disciplines'][$disc]['points']) * floatval($D['multiplier']);
          $points -= floatval($T['disciplines'][$disc]['penalty']) * floatval($D['faults']);
        }
        $M['teams'][$team]['points'] = $points;
        $count = 0;
        $birth = 0;
        foreach($T['starters'] as $starter => $S) {
          $birth += $S['birthday'];
          $count ++;
        }
        $birth /= $count;
        if ($birth >= $oldest['date']) {
          $oldest['date'] = $birth;
          $oldest['team'] = $team;
        }
        $M['teams'][$team]['oldest'] = false;
      }
      $M['teams'][$oldest['team']]['oldest'] = true;
      // sort by points
      uasort($M['teams'], 'sortTeams');
      $place = 0;
      $last = 1001;
      // set place
      foreach($M['teams'] as $team => $T) {
        if ($T['points'] < $last)
          $place ++;
        $M['teams'][$team]['place'] = $place;
        $last = $T['points'];
      }
      // cleanup certs directory
      $folder = "./certificates";
      $files = glob($folder.'/*');
      foreach($files as $file) {
        if(is_file($file))
          unlink($file);
      }
      // generate certs
      $total = count($M['teams']);
      $c = 0;
      certHeader();
      ob_flush();
      flush();
      foreach($M['teams'] as $team => $T) {
        $percent = intVal(($c / $total) * 100) . '%';
        echo '<script type="text/javascript">document.getElementById("bar").style.width="' . $percent . '";' . "\n";
        echo 'document.getElementById("info").innerHTML = "' . $percent . '"</script>' . "\n";
        ob_flush();
        flush();
        certificate($T['starters'][0]['name'], $T['starters'][1]['name'], $T['name'], $T['place'], $T['image'], $T['oldest']);
        $c += 1;
      }
      echo '<script type="text/javascript">document.getElementById("bar").style.width="100%";' . "\n";
      echo 'document.getElementById("info").innerHTML = "Fertig!"</script>' . "\n";
      ob_flush();
      flush();
      // zip certs
      $files = './certificates/';
      $target = "./certificates/Urkunden.zip";
      $zip = new ZipArchive;
      if($zip -> open($target, ZipArchive::CREATE ) === TRUE) {
        $dir = opendir($files);
        while($file = readdir($dir)) {
          if(is_file($files.$file)) {
            $zip -> addFile($files.$file, $file);
          }
        }
      }
      certFooter();
      return;
  }

  return ['model' => getModel($user, $role), 'error' => $error ];
}
?>
