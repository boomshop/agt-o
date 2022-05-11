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
      // generate certs
      foreach($M['teams'] as $team => $T) {
        certificate($T['starters'][0]['name'], $T['starters'][1]['name'], $T['name'], $T['place'], $T['image'], $T['oldest']);
      }
      // print_r($M['teams']);
      break;
  }

  return ['model' => getModel($user, $role), 'error' => $error ];
}
?>
