<?
function handleRequest($data, $user, $role) {
  global $SQL, $_ERROR;
  $error = '';

  switch($data['action']) {
    case 'editProgress':
      $avail = $SQL->fetchArray('SELECT * FROM progress WHERE team=' . $SQL->escape($data['team']) . ' AND discipline=' . $SQL->escape($data['discipline']) );
      if ($avail) {
        $query = 'UPDATE progress SET state=\'' . $SQL->escape($data['state']) . '\', referee=' . $user . ', date=' . time() . ' WHERE team=\'' . $SQL->escape($data['team']) . '\' AND discipline=\'' . $SQL->escape($data['discipline']) . '\'';
        $SQL->query($query);
        $error = $query;
      } else {
        $d = [ 'team'=>$data['team'], 'discipline'=>$data['discipline'], 'state'=>$data['state'], 'referee'=>$user, 'date'=>time() ];
        $query = $SQL->buildInsertQuery('progress', $d);
        $SQL->query($query);
        $error = $query;
      }
      $error .= $SQL->lastError();
      break;
    case 'editValuation':
      $avail = $SQL->fetchArray('SELECT * FROM valuations WHERE team=' . $SQL->escape($data['team']) . ' AND discipline=' . $SQL->escape($data['discipline']) );
      if ($avail) {
        $d = [
          'points' => $data['points'],
          'penalty' => $data['penalty'],
          'reason' => $data['reason'],
          'referee' => $user,
          'date' => time(),
        ];
        $query = $SQL->buildUpdateQuery('valuations', $d, 'WHERE team=\'' . $SQL->escape($data['team']) . '\' AND discipline=\'' . $SQL->escape($data['discipline']) . '\'');
        $SQL->query($query);
        $error = $query;
      } else {
        $d = [
          'team'=>$data['team'],
          'discipline' => $data['discipline'],
          'points' => $data['points'],
          'penalty' => $data['penalty'],
          'reason' => $data['reason'],
          'referee' => $user,
          'date' => time(),
        ];
        $query = $SQL->buildInsertQuery('valuations', $d);
        $SQL->query($query);
        $error = $query;
      }
      $error .= $SQL->lastError();
      break;
  }
  return ['model' => getModel($user, $role), 'sql' => $error ];
}

?>
